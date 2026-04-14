#!/usr/bin/env python3
"""
从 AISHELL-3 采样构造 ./corpus/{m|f}_{spk}_{utt}/ 目录布局。

输入:
  corpus-src/aishell3/train/wav/<SPK>/<UTT>.wav
  corpus-src/aishell3/train/content.txt    # "<UTT>.wav 字 字 字 ..."
  corpus-src/aishell3/spk-info.txt         # <SPK> <AGE> <GENDER> <REGION>

输出:
  corpus/{m|f}_<SPK>_<UTT>/recording.wav
  corpus/{m|f}_<SPK>_<UTT>/transcript.txt
  corpus/_manifest.json

用法:
  python tools/build_zh_corpus.py \
      --src corpus-src/aishell3 \
      --dst corpus \
      --n-per-gender 200 \
      --cap-per-speaker 5 \
      --dict mandarin_dict.txt
"""
import argparse, json, os, random, re, shutil, sys
from collections import defaultdict

CJK = re.compile(r'[\u4e00-\u9fff]')

def load_spk_gender(path):
	"""spk-info.txt 列: spk age gender region（空白分隔，可能带表头）。"""
	out = {}
	with open(path, encoding='utf-8') as f:
		for line in f:
			parts = line.strip().split()
			if len(parts) < 3: continue
			spk, _age, gender = parts[0], parts[1], parts[2]
			g = gender.lower()
			if g in ('male', 'm'): out[spk] = 'm'
			elif g in ('female', 'f'): out[spk] = 'f'
	return out

def load_content(path):
	"""content.txt: '<UTT>.wav 字1 字2 ...'（字后可能跟拼音，格式 '字 pinyin'）。
	AISHELL-3 实际格式为交错: 字 pinyin 字 pinyin ...；只取 CJK 字符。"""
	out = {}
	with open(path, encoding='utf-8') as f:
		for line in f:
			parts = line.strip().split(maxsplit=1)
			if len(parts) != 2: continue
			utt_wav, rest = parts
			utt = utt_wav.replace('.wav', '')
			chars = CJK.findall(rest)
			if chars:
				out[utt] = chars
	return out

def load_dict_chars(path):
	"""mandarin_dict.txt 第一列为词条；收集单字集合（过滤 OOV 用）。"""
	chars = set()
	with open(path, encoding='utf-8-sig') as f:
		for line in f:
			w = line.split('\t', 1)[0].strip()
			if len(w) == 1 and CJK.match(w):
				chars.add(w)
	return chars

def main():
	ap = argparse.ArgumentParser()
	ap.add_argument('--src', default='corpus-src/aishell3')
	ap.add_argument('--dst', default='corpus')
	ap.add_argument('--n-per-gender', type=int, default=200)
	ap.add_argument('--cap-per-speaker', type=int, default=5)
	ap.add_argument('--dict', default='mandarin_dict.txt')
	ap.add_argument('--seed', type=int, default=42)
	ap.add_argument('--min-chars', type=int, default=4)
	ap.add_argument('--max-chars', type=int, default=20)
	args = ap.parse_args()

	random.seed(args.seed)

	spk_gender = load_spk_gender(os.path.join(args.src, 'spk-info.txt'))
	# AISHELL-3 content.txt 在 train/ 下
	content = load_content(os.path.join(args.src, 'train', 'content.txt'))
	dict_chars = load_dict_chars(args.dict) if os.path.exists(args.dict) else None
	print(f'speakers with gender: {len(spk_gender)}',
	      f'(m={sum(1 for v in spk_gender.values() if v=="m")},',
	      f'f={sum(1 for v in spk_gender.values() if v=="f")})')
	print(f'utterances: {len(content)}')
	print(f'dict single-chars: {len(dict_chars) if dict_chars else "(skipped)"}')

	by_spk = defaultdict(list)
	for utt, chars in content.items():
		spk = utt[:7]  # SSB0005 -> 7 chars
		if spk not in spk_gender: continue
		if not (args.min_chars <= len(chars) <= args.max_chars): continue
		if dict_chars and not all(c in dict_chars for c in chars): continue
		by_spk[spk].append((utt, chars))

	picked = {'m': [], 'f': []}
	spks_by_gender = {'m': [], 'f': []}
	for spk, gender in spk_gender.items():
		if by_spk.get(spk):
			spks_by_gender[gender].append(spk)
	for g in ('m', 'f'):
		random.shuffle(spks_by_gender[g])

	for gender, target in (('m', args.n_per_gender), ('f', args.n_per_gender)):
		per_spk_count = defaultdict(int)
		# round-robin across shuffled speakers
		exhausted = False
		while len(picked[gender]) < target and not exhausted:
			exhausted = True
			for spk in spks_by_gender[gender]:
				if per_spk_count[spk] >= args.cap_per_speaker: continue
				pool = [x for x in by_spk[spk]
				        if not any(u == x[0] for u, _ in picked[gender])]
				if not pool: continue
				utt, chars = random.choice(pool)
				picked[gender].append((utt, chars))
				per_spk_count[spk] += 1
				exhausted = False
				if len(picked[gender]) >= target: break
		print(f'picked {gender}: {len(picked[gender])} from {sum(1 for v in per_spk_count.values() if v)} speakers')

	n = min(len(picked['m']), len(picked['f']))
	picked['m'] = picked['m'][:n]
	picked['f'] = picked['f'][:n]
	print(f'balanced to {n}+{n}')

	os.makedirs(args.dst, exist_ok=True)
	manifest = {'src': args.src, 'n_per_gender': n, 'items': []}
	wav_root = os.path.join(args.src, 'train', 'wav')
	for gender, items in picked.items():
		for utt, chars in items:
			spk = utt[:7]
			d = os.path.join(args.dst, f'{gender}_{spk}_{utt}')
			os.makedirs(d, exist_ok=True)
			src_wav = os.path.join(wav_root, spk, utt + '.wav')
			dst_wav = os.path.join(d, 'recording.wav')
			if not os.path.exists(dst_wav):
				shutil.copy2(src_wav, dst_wav)
			with open(os.path.join(d, 'transcript.txt'), 'w', encoding='utf-8') as f:
				f.write(''.join(chars))
			manifest['items'].append({'dir': d, 'gender': gender, 'spk': spk, 'utt': utt, 'chars': chars})

	with open(os.path.join(args.dst, '_manifest.json'), 'w', encoding='utf-8') as f:
		json.dump(manifest, f, ensure_ascii=False, indent=2)
	print(f'wrote {args.dst}/_manifest.json with {len(manifest["items"])} items')

if __name__ == '__main__':
	main()
