# 如何跑通这个项目

## 你需要手动做的只有一步

---

## 第一步：下载 Praat

1. 打开：https://www.fon.hum.uva.nl/praat/download_win.html
2. 下载 **praat_win64.zip**
3. 解压，把 `Praat.exe` 放到：
   ```
   C:\Users\fanhe\praat\Praat.exe
   ```
   （先在 `C:\Users\fanhe\` 下新建一个叫 `praat` 的文件夹）

---

## 第二步：启动服务器

按 **Win+R**，输入 `cmd`，回车，打开命令提示符。

复制粘贴以下两行命令：

```
cd E:\ai\gender-voice-visualization
C:\Users\fanhe\AppData\Local\Programs\Python\Python312\python.exe serve.py
```

看到这行说明启动成功：
```
启动成功！请打开浏览器访问：http://localhost:8080
```

打开浏览器，访问 **http://localhost:8080**

---

## 使用方法

1. 点右上角 **「Add Clip」**
2. **Language** 选 **中文**
3. **Script** 选一段朗读短文（如「彩虹」段落）
4. 朗读那段文字，录一段音频（手机录音发给自己，mp3/m4a/wav 都行）
5. 点 **Upload a file**，上传录音
6. 点 **Add Clip**，等待分析（30 秒到几分钟）
7. 你的声音会以一个点出现在声域图上

---

## 出问题了怎么办

**点 Add Clip 之后弹出错误**
- 按 F12 打开浏览器开发者工具，切到 **Console** 标签
- 截图发给我

**提示找不到 Praat.exe**
- 确认 `C:\Users\fanhe\praat\Praat.exe` 这个文件存在

**服务器启动报错**
- 确认命令里的路径没有拼写错误
- 把报错内容截图发给我

---

## 各文件说明

| 文件 | 作用 |
|---|---|
| `index.html` | 网站前端页面（已编译好，直接用）|
| `backend.cgi` | 处理音频分析的后端脚本 |
| `serve.py` | 本地服务器启动脚本 |
| `settings.json` | 工具路径和目录配置 |
| `stats.json` | 英文音素统计基线 |
| `stats_zh.json` | 中文音素统计基线 |
| `mandarin_dict.txt` | 中文发音字典 |

---

## 分析流程（了解一下就行）

```
你的录音
  ↓ ffmpeg + sox（格式转换 + 降噪）
  ↓ Montreal Forced Aligner（把每个字对齐到时间轴）
  ↓ Praat（提取每个音素的音高 + 共振峰 F1/F2/F3）
  ↓ Python（与统计基线对比，计算共鸣分数）
  ↓ 声域图上的一个点（X轴=共鸣，Y轴=音高）
```
