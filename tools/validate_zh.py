#!/usr/bin/env python3
"""
v0.1.1 stats_zh.json 验证:
  - 从 corpus-processed-zh/ 留出 20 m + 20 f（默认取末尾 20 条/性别）。
  - 加载当前 stats_zh.json + weights (weights_zh.json 或 weights.json)。
  - 对每条 held-out 跑 resonance.compute_resonance(lang='zh')。
  - 断言 median(m) < median(f)；二分类准确率以全体中位数为阈值。

用法:
  python tools/validate_zh.py --processed corpus-processed-zh --holdout 20
"""
import argparse, json, os, sys
from statistics import median

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'acousticgender'))
from library import phones, resonance

def load_data(processed_dir, holdout):
	m, f = [], []
	for d in sorted(os.listdir(processed_dir)):
		tsv = os.path.join(processed_dir, d, 'output', 'recording.tsv')
		if not os.path.exists(tsv): continue
		with open(tsv, encoding='utf-8') as fh:
			tsv_text = fh.read()
		data = phones.parse(tsv_text, lang='zh')
		if not data.get('phones'): continue
		if d[0] == 'm': m.append((d, data))
		elif d[0] == 'f': f.append((d, data))
	n = min(len(m), len(f), holdout)
	print(f'held-out: m={n}, f={n} (available m={len(m)}, f={len(f)})')
	return m[-n:], f[-n:]

def main():
	ap = argparse.ArgumentParser()
	ap.add_argument('--processed', default='corpus-processed-zh')
	ap.add_argument('--holdout', type=int, default=20)
	ap.add_argument('--stats', default='stats_zh.json')
	ap.add_argument('--weights', default=None,
		help='默认优先 weights_zh.json，缺失回退 weights.json')
	args = ap.parse_args()

	repo_root = os.path.join(os.path.dirname(__file__), '..')
	os.chdir(repo_root)

	if args.weights is None:
		args.weights = 'weights_zh.json' if os.path.exists('weights_zh.json') else 'weights.json'
	print(f'using stats={args.stats}, weights={args.weights}')

	with open(args.weights) as f:
		weights = json.load(f)

	m_data, f_data = load_data(args.processed, args.holdout)
	if not m_data or not f_data:
		print('ERROR: empty held-out set'); sys.exit(2)

	m_res, f_res = [], []
	for name, d in m_data:
		resonance.compute_resonance(d, weights, lang='zh')
		m_res.append(d.get('meanResonance'))
		print(f'  m {name}: {d.get("meanResonance"):.3f}')
	for name, d in f_data:
		resonance.compute_resonance(d, weights, lang='zh')
		f_res.append(d.get('meanResonance'))
		print(f'  f {name}: {d.get("meanResonance"):.3f}')

	m_res = [x for x in m_res if x is not None]
	f_res = [x for x in f_res if x is not None]
	mm, fm = median(m_res), median(f_res)
	print(f'median m={mm:.3f}  f={fm:.3f}  Δ={fm-mm:+.3f}')

	thr = median(m_res + f_res)
	correct = sum(1 for x in m_res if x <= thr) + sum(1 for x in f_res if x >= thr)
	acc = correct / (len(m_res) + len(f_res))
	print(f'threshold={thr:.3f}  accuracy={acc:.3f}')

	ok = (mm < fm) and (acc >= 0.85)
	print('PASS' if ok else 'FAIL')
	sys.exit(0 if ok else 1)

if __name__ == '__main__':
	main()
