# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概要

`gender-voice-visualization` 的中文适配分支（`working-chinese-version`），当前 v0.1.2。Fork 自上游英文版，在同一套 MFA + Praat + z-score 管线上增加普通话支持。上游英文版维持在 `master`，中文改动全部在此分支，合并到 `master` 不是目标。

## 常用命令

```bash
# 本地开发（必须先退出 mfa conda env 回到 .venv，因 web 依赖在 .venv）
conda deactivate
python serve.py                              # http://localhost:8888

# 下载 MFA mandarin_mfa 声学模型（必须 v2.0.0，v3 音素集不兼容）
mfa model download acoustic mandarin_mfa --version 2.0.0 --ignore_cache

# 从 AISHELL-3 采样语料
python tools/build_zh_corpus.py

# 跑 corpus 聚合 stats_zh.json（不训权重）
PYTHONPATH=acousticgender .venv/bin/python acousticgender/corpusanalysis.py \
  --lang zh --jobs 8 --skip-weights \
  --corpus-dir corpus --processed-dir corpus-processed-zh --stats-out stats_zh.json

# 10-fold CV 暴力搜索 weights_zh.json（见 README §7.6 完整参数）
# --weights-granularity 500 → coarse；--weights-refine 在邻域精搜；--weights-chunk 防爆内存

# held-out 验证（要求 median(m) < median(f) 且 acc ≥ 0.85）
.venv/bin/python tools/validate_zh.py --processed corpus-processed-zh --holdout 20

# Railway 容器构建（Dockerfile 基于 mambaorg/micromamba，预装 MFA + mandarin_mfa）
docker build -t gvv .
```

没有单元测试框架；`tools/validate_zh.py` 即是回归测试（阈值 acc ≥ 0.85）。

## 架构要点

**请求流水线**（`backend.cgi` 收到 multipart 后）：

```
recording.{wav,mp3,m4a} + transcript + lang
  → preprocessing.process()   ffmpeg 静音检测/降噪 → sox noisered → 16k mono wav
                              → MFA align (mandarin_mfa | english_mfa) → TextGrid
                              → praat textgrid-formants.praat → TSV(time,phone,F0..F3)
  → phones.parse()            TSV + 词典 (mandarin_dict.txt | cmudict.txt) → {words, phones}
  → resonance.compute_resonance()
                              outlier 去除（|F-μ|>2σ）→ z-score（按 stats_zh.json / stats.json）
                              → clip(Z·W + 0.5, 0, 1)
  → JSON {words, phones, mean, stdev, resonance}
```

**中文与英文的关键分歧**（都由 `lang` 参数驱动，改动时务必同时检查三处）：

| 层 | 英文 | 中文 |
|----|------|------|
| `preprocessing.py` | transcript 原样给 MFA | `re.findall(r'[\u4e00-\u9fff]', transcript)` 字符级空格分词，否则整句变 `<unk>` |
| `phones.py` 词典 | `cmudict.txt`（ARPABET, iso-8859-1） | `mandarin_dict.txt`（IPA，tab 分隔，第 6 列，UTF-8-BOM） |
| `resonance.py` | 直接查 stats | 先 `_strip_tone()` 去除 `[˥˦˧˨˩]`；元音集是 `ZH_VOWELS`（含零韵母 `ʐ̩`/`z̩`） |
| 模型文件 | `stats.json`, `weights.json=[0.73,0.27,0]` | `stats_zh.json`（AISHELL-3 实测聚合）、`weights_zh.json=[0.658,0.242,0.1]`（10-fold CV） |
| 前端 | pitch `/250`，上界 300 Hz，元音判定 ARPABET | pitch `/450`（`ui/util.js:28`），上界 500 Hz（`ui/voice-graph.js:13`），元音判定 `ZH_VOWELS` 去声调 IPA |

**`stats_zh.json` 不是手写**：v0.1.0 曾经手写，z-score 分母过窄导致 resonance 贴边；v0.1.1 起必须由 `corpusanalysis.py` 跑语料聚合出来（schema = 每音素 `[F0,F1,F2,F3]` × `{mean,stdev,median,max,min}`）。改动音素集或统计逻辑时一起重跑 `weights_zh.json`。

**`corpusanalysis.py` 并行约束**：每 worker 必须独立 `MFA_ROOT_DIR`（`pretrained_models/models/extracted_models` 软链到 `~/Documents/MFA`），否则并发写 `command_history.yaml` 会崩。`_process_one` 需接住 `preprocessing.process` 返回的 TSV 直接落盘，原版的 `shutil.rmtree(tmp_dir)` 会把 Praat 输出删掉。

**i18n**：`ui/i18n.js` 是 `I18N.en` / `I18N.zh` 字典 + HTML 上的 `data-i18n="key"`。`backend.cgi` 会把 `zh-CN` 归一化为 `zh`。

**部署**：本地 `serve.py`（Python CGIHTTPServer，读 `PORT`/`HOST`）；Railway 走 `Dockerfile`（`mambaorg/micromamba` + 预下载 MFA 模型 + `spacy-pkuseg/dragonmapper/hanziconv`，这些是 mandarin_mfa 字对齐隐式依赖，容器内缺失会 import 报错）。容器里必须显式设置 `MFA_ROOT_DIR`，默认 `~/Documents/MFA` 不可写。MFA 调用失败时让 stderr 冒泡，不要静默吞掉。

## 已知坑

- `mandarin_mfa` 词典仅发到 v2.0.0；声学默认下 v3.0.0，音素集不兼容（会 `80125 pronunciations ignored`），必须显式降声学到 v2.0.0。
- `ffmpeg silencedetect` 对"开头即静音"录音产出不配对的 `silence_end`，导致 `aselect` `between(t,,X)` 报错——`preprocessing.py` 用 try/except 回退到原文件，不要去掉。
- `settings.json` 里的 `ffmpeg`/`sox`/`praat`/`mfa` 是**绝对路径**，所以 `serve.py` 不需要处于 `mfa` conda env，但必须在装了 web 依赖（`maxminddb`/`python-magic` 等）的 `.venv` 里跑。

## 参考

- `README.md` §7 是 v0.1.1 stats/weights 训练完整复现记录；§8 是 v0.1.2 Railway 部署。
- `CHANGELOG_ZH.md` 为版本根因/修复记录。
- `intro.md` Windows 快速上手。
