#!/usr/bin/env python3

print('corpusanalysis.py: __package__ ->', __package__)

import os, sys, subprocess, json, argparse
from collections import defaultdict
from statistics import mean, median, stdev
from concurrent.futures import ProcessPoolExecutor, as_completed

from library import preprocessing, phones, resonance
from library.resonance import _strip_tone

parser = argparse.ArgumentParser()
parser.add_argument('--lang', default='en', choices=['en', 'zh'])
parser.add_argument('--corpus-dir', default='./corpus')
parser.add_argument('--processed-dir', default=None,
	help='默认 ./corpus-processed（en）或 ./corpus-processed-zh（zh）')
parser.add_argument('--stats-out', default=None,
	help='默认 stats.json（en）或 stats_zh.json（zh）')
parser.add_argument('--weights-out', default=None,
	help='默认 weights.json（en）或 weights_zh.json（zh）')
parser.add_argument('--skip-weights', action='store_true',
	help='只生成 stats，不跑权重暴力搜索')
parser.add_argument('--jobs', type=int, default=1,
	help='并行 worker 数（preprocessing 阶段）；1=串行')
args = parser.parse_args()

lang = args.lang
corpus_dir = args.corpus_dir
processed_corpus_dir = args.processed_dir or (
	'./corpus-processed' if lang == 'en' else './corpus-processed-zh')
stats_out = args.stats_out or ('stats.json' if lang == 'en' else 'stats_zh.json')
weights_out = args.weights_out or ('weights.json' if lang == 'en' else 'weights_zh.json')

def phoneme_key(phone):
	return _strip_tone(phone['phoneme']) if lang == 'zh' else phone['phoneme']

def _process_one(directory, corpus_dir, processed_corpus_dir, lang):
	# 每 worker 独立 MFA_ROOT_DIR，避免并发写 command_history.yaml / temp 冲突。
	# 但要软链 pretrained_models / models / extracted_models / global_config.yaml
	# 到默认 ~/Documents/MFA，否则找不到已下载的 mandarin_mfa。
	mfa_root = os.path.abspath(processed_corpus_dir + '/.mfa-root-' + str(os.getpid()))
	if not os.path.exists(mfa_root):
		os.makedirs(mfa_root)
		default_root = os.path.expanduser('~/Documents/MFA')
		for sub in ('pretrained_models', 'models', 'extracted_models', 'global_config.yaml'):
			src = os.path.join(default_root, sub)
			dst = os.path.join(mfa_root, sub)
			if os.path.exists(src) and not os.path.exists(dst):
				os.symlink(src, dst)
	os.environ['MFA_ROOT_DIR'] = mfa_root
	transcript = ''
	recording = None
	src = corpus_dir + '/' + directory
	for filename in os.listdir(src):
		if filename.endswith('.txt'):
			with open(src + '/' + filename, encoding='utf-8') as f:
				transcript = f.read()
		elif any(filename.endswith(ext) for ext in ['.wav', '.mp3', '.ogg', '.opus']):
			with open(src + '/' + filename, 'rb') as f:
				recording = f.read()
	# preprocessing.process 会 os.mkdir(tmp_dir) + 最后 shutil.rmtree(tmp_dir)，
	# 所以用一次性 tmp 路径，把返回的 TSV 文本落到持久 processed_dir。
	tmp_dir = processed_corpus_dir + '/' + directory + '.tmp'
	persist_dir = processed_corpus_dir + '/' + directory
	if os.path.exists(tmp_dir):
		import shutil as _sh; _sh.rmtree(tmp_dir)
	if os.path.exists(persist_dir):
		return (directory, True, 'already-done')
	try:
		praat_tsv = preprocessing.process(recording, transcript, tmp_dir, lang=lang)
		if not praat_tsv:
			return (directory, False, 'empty praat output')
		os.makedirs(persist_dir + '/output', exist_ok=True)
		with open(persist_dir + '/output/recording.tsv', 'w', encoding='utf-8') as f:
			f.write(praat_tsv)
		return (directory, True, None)
	except Exception as e:
		return (directory, False, str(e))

if not os.path.exists(processed_corpus_dir):
	os.makedirs(processed_corpus_dir)
	subprocess.run(['chmod', '777', '-R', processed_corpus_dir])

# 总是遍历，per-dir 幂等跳过（_process_one 内部检查 persist_dir 是否已存在）
if True:
	dirs = sorted([d for d in os.listdir(corpus_dir)
	               if os.path.isdir(os.path.join(corpus_dir, d)) and not d.startswith('_')])
	if args.jobs <= 1:
		for d in dirs:
			r = _process_one(d, corpus_dir, processed_corpus_dir, lang)
			print(r)
	else:
		with ProcessPoolExecutor(max_workers=args.jobs) as ex:
			futs = {ex.submit(_process_one, d, corpus_dir, processed_corpus_dir, lang): d for d in dirs}
			done = 0
			for fut in as_completed(futs):
				r = fut.result()
				done += 1
				print(f'[{done}/{len(dirs)}]', r[0], 'ok' if r[1] else 'FAIL', r[2] or '')

m_count = 0
f_count = 0
m_data = []
f_data = []
for directory in os.listdir(processed_corpus_dir):
	tsv_file =  (processed_corpus_dir + '/' + directory +
	             '/output/recording.tsv')
	if os.path.exists(tsv_file):
		with open(tsv_file) as f:
			tsv_text = f.read()

		if directory[0] == 'm':
			m_data.append(phones.parse(tsv_text, lang=lang))
			m_count += 1
		if directory[0] == 'f':
			f_data.append(phones.parse(tsv_text, lang=lang))
			f_count += 1

if len(f_data) > len(m_data):
	f_data = f_data[0:len(m_data)]
if len(m_data) > len(f_data):
	m_data = m_data[0:len(f_data)]

print('lang', lang)
print('m_count', m_count)
print('f_count', f_count)
print('len(f_data)', len(f_data))
print('len(m_data)', len(m_data))


population_phones = defaultdict(list)
for data in m_data + f_data:
	for phone in data['phones']:
		if (phone['F'] and phone['F'][0] and phone['F'][1] and
		    phone['F'][2] and phone['F'][3]
		):
			population_phones[phoneme_key(phone)].append(phone)

phone_stats = {}

for phoneme in population_phones:
	print(phoneme)
	Fs = [[phone['F'][i] for phone in population_phones[phoneme] ]
	       for i in range(4)]
	# stdev 需要至少 2 个样本
	if len(Fs[0]) < 2:
		print('\tskip (only', len(Fs[0]), 'sample)')
		continue
	for i in range(4):
		print('\tf' + str(i), mean(Fs[i]), stdev(Fs[i]))

	phone_stats[phoneme] = [
		{	'mean' : mean(Fs[i]),
			'stdev': stdev(Fs[i]),
			'median': median(Fs[i]),
			'max': max(Fs[i]),
			'min': min(Fs[i]),
		} for i in range(4)
	]

with open(stats_out, 'w') as f:
	f.write(json.dumps(phone_stats, ensure_ascii=False))
print('wrote', stats_out)

if args.skip_weights:
	sys.exit(0)

# A little brute-forcing never hurt anyone.
granularity = 56
weights_candidates = []
for i in range(granularity + 1):
	for j in range(granularity + 1):
		for k in range(granularity + 1):
			if i + j + k == granularity:
				weights_candidates.append([
					i / granularity,
					j / granularity,
					k / granularity
				])

max_accuracy = 0
winner = None
for weights in weights_candidates:

	for data in m_data + f_data:
		resonance.compute_resonance(data, weights, lang=lang)

	median_resonance = median([data['meanResonance'] for data in m_data + f_data])

	correct_count = 0
	total = 0

	for data in m_data:
		if data['meanResonance'] <= median_resonance:
			correct_count += 1
		total += 1

	for data in f_data:
		if data['meanResonance'] >= median_resonance:
			correct_count += 1
		total += 1

	accuracy = correct_count / total
	if accuracy >= max_accuracy:
		max_accuracy = accuracy
		winner = weights
	print(weights, accuracy)

print('Best weight:', winner)

with open(weights_out, 'w') as f:
	f.write(json.dumps(winner))
print('wrote', weights_out)
