# gender-voice-visualization — 中文适配版

Fork 自 upstream 英文版，在 `working-chinese-version` 分支上增加了普通话支持。本文档汇总所有相对上游 `master` 的实质改动（不含纯 CRLF/LF 换行噪声）。

---

## 1. 新增文件

| 文件 | 用途 |
|------|------|
| `mandarin_dict.txt` | MFA `mandarin_mfa` v2.0.0 发音词典（字 → 带声调 IPA） |
| `stats_zh.json` | 普通话元音 F1/F2/F3 性别中性参考统计，供 `resonance.py` 做 z-score |
| `serve.py` | 本地 CGI 开发服务器（`python serve.py` → `http://localhost:8888`） |
| `intro.md` | 介绍文案 |
| `.claude/settings.local.json` | Claude Code 本地配置 |

---

## 2. 后端改动（Python）

### `acousticgender/library/preprocessing.py`
- 新增 `lang` 参数；`lang='zh'` 时切到 MFA `mandarin_mfa` 声学 + 词典。
- Windows conda 布局兼容：通过 `env/python.exe + Scripts/mfa-script.py` 调用 MFA，并补全 `PATH` / `CONDA_PREFIX`；Linux 仍走 `settings['mfa']` shim。
- **中文 transcript 预处理**：`re.findall(r'[\u4e00-\u9fff]', transcript)` 拆成单字后用空格连接写入 `recording.txt`，否则 MFA 会把整句当作一个未登录词 `<unk>`。
- 追加 MFA stdout/stderr 落到 stderr，便于调试。

### `acousticgender/library/phones.py`
- `parse(praat_output, lang='en')` 支持 zh：读 `mandarin_dict.txt`（tab 分隔，第 6 列为音素序列，UTF-8-BOM）。
- 边界加固：空 praat 输出返回 `{'words': [], 'phones': []}`；`word_index` 越界时跳过。

### `acousticgender/library/resonance.py`
- `compute_resonance(data, weights, lang='en')`：zh 模式加载 `stats_zh.json`。
- `_strip_tone()`（正则 `[˥˦˧˨˩]+`）：MFA 输出的音素带声调符（如 `a˥˥`、`i˧˥`），查 stats 前先剥离。
- 导出常量 `ZH_VOWELS = {'a','aj','aw','e','ej','i','io','o','ow','u','y','ə','ɥ','ʐ̩','z̩'}`（含零韵母 `ʐ̩`/`z̩`）。

### `backend.cgi` / `build.cgi`
- 透传 `lang` 参数给后端流水线。

### `settings.json`
- 本地化 `ffmpeg` / `sox` / `praat` / `mfa` 绝对路径（指向 miniconda `envs/mfa`）。

---

## 3. 前端改动（UI）

| 位置 | 改动 | 原因 |
|------|------|------|
| `ui/util.js:28` | `pitchPercent` 归一化 `(pitch-50)/250` → `/450` | 容纳中文女声高音 |
| `ui/voice-graph.js:13` | `pitchUpperBoundHz`: `300` → `500` | 同上 |
| `ui/voice-graph.js` `update()` | 元音判定新增去声调后的 IPA `ZH_VOWELS` 集合 | 原来只判 ARPABET（AEIOUY），中文 marker 无法逐音节跳动 |

其余 UI 文件的 diff 主要是 CRLF/LF 差异，非语义改动。

---

## 4. `stats_zh.json` 调参说明

- **问题**：早期手写版均值偏男声、stdev 过窄 → 共振值贴边 100%（观察到 mean 91% / median 100% / stdev 16%）。
- **修复**：均值取男/女文献值中点；stdev 约为原值 2×（F1 ~90–120 Hz，F2 ~200–300 Hz，F3 ~300–400 Hz）。
- **目标区间**：典型男声 Resonance ~30–45%，女声 ~55–75%。
- **Schema** 同英文 `stats.json`：每音素 4 行 `[F0, F1, F2, F3]`，每行 `{mean, stdev, median, max, min}`。

---

## 5. 已知坑 / 注意事项

- **MFA 版本**：`mandarin_mfa` 词典只发布到 v2.0.0 / v2.0.0a；声学默认下 v3.0.0，两者音素集不一致（会报 `80125 pronunciations ignored`）。需显式降级：
  ```bash
  mfa model download acoustic mandarin_mfa --version 2.0.0 --ignore_cache
  ```
- **环境切换**：跑 `serve.py` 前要 `conda deactivate` 回到 `.venv`（`mfa` env 没有 `maxminddb` 等 web 依赖）。后端通过 `settings.json` 的绝对路径调 mfa env 的 `mfa`，不需要 shell 处于 mfa env。
- **ffmpeg silencedetect**：对"开头即静音"的录音会产生不配对的 `silence_end`，导致 `aselect` 表达式出现 `between(t,,X)` 空参数报错。当前代码用 `try/except Exception` 回退到原始文件，不致命。

---

## 6. 运行方法

**依赖**：`ffmpeg`、`sox`、`praat`、MFA（conda env `mfa`，声学 + 词典均为 `mandarin_mfa` v2.0.0）。

```bash
# 回到 .venv
conda deactivate
# 启动本地服务器
python serve.py
# 浏览器打开 http://localhost:8888
# UI 里切换为中文，再录音 / 上传
```
