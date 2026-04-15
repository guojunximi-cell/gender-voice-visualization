// Lightweight i18n: dictionary + apply via data-i18n attributes.
// 前端只走中文；后端仍保留双语逻辑供参考。
const I18N = {
	en: {
		'app.title': 'Acoustic Genderspace Viewer - Research Trial',
		'header.clip': 'Clip',
		'header.newClip': 'Add new clip',
		'header.adding': 'Adding clip...',
		'header.switchLang': 'Switch language',
		'header.playPause': 'play/pause',

		'tab.details': 'Details',
		'tab.help': 'Help',
		'tab.settings': 'Settings',

		'details.heading': 'Clip Details',
		'details.instructions': 'When you select a clip/point from the graph it will be displayed here. If you just loaded the page and are seeing this, your browser is downloading the examples and they will display as they arrive. If you are on a slow connection, you may wish to start by reading the instructions in the help tab while you wait.',
		'details.deleteConfirm': 'Press again to delete',
		'details.deleteTitle': 'Delete Clip',
		'details.downloadTitle': 'Download Clip',
		'details.mean': 'Mean',
		'details.median': 'Median',
		'details.stdev': 'St. dev.',
		'details.pitch': 'Pitch',
		'details.resonance': 'Resonance',
		'details.transcript': 'Transcript',
		'details.advanced': 'Advanced',
		'details.dlJson': 'Download JSON',
		'details.stdevNote': '* In many contexts, greater variation in pitch (standard deviation) is associated with women\u2019s speech, whereas monotone is associated with men\u2019s speech.',

		'settings.yourData': 'Your Data',
		'settings.export': 'Export',
		'settings.import': 'Import',
		'settings.examples': 'Examples',
		'settings.reloadDefaults': 'Reload Defaults',
		'settings.loadExtended': 'Load Extended',
		'settings.extendedWarn': 'Warning: The extended set of examples may use large amounts of data.',
		'settings.theme': 'Theme',
		'settings.customize': 'Customize',
		'settings.roundedCorners': 'Rounded Corners:',
		'settings.shadowStrength': 'Shadow Strength:',
		'settings.shadowSpread': 'Shadow Spread:',
		'settings.highlightStrength': 'Highlight Strength:',
		'settings.bg': 'background color',
		'settings.text': 'text color',
		'settings.chromeColor': 'chrome color',
		'settings.chromeBg': 'chrome background',
		'settings.chromeBorder': 'chrome border',
		'settings.accent': 'accent',
		'settings.accentText': 'accent text',
		'settings.btnColor': 'button color',
		'settings.btnBg': 'button background',
		'settings.inputColor': 'input color',
		'settings.inputBg': 'input background',
		'settings.importNoFile': 'You need to select the file containing your exported data.',

		'help.tutorial': 'Tutorial',
		'help.mobileTip': 'Mobile users: You can tap the top edge of this pane to expand/collapse it for easier reading.',
		'help.intro': 'This app visualizes the pitch and resonance of voices in recordings over time. <strong>Pitch</strong> is our perception of the frequency at which the vocal folds vibrate. <strong>Resonance</strong> is the effect exerted on a sound by the passage the air travels through. The program plots recordings in a <strong>2-dimensional space</strong>, where the Y-axis represents pitch, and the X-axis represents resonance, with brighter sounds represented with a higher percentage.',
		'help.spectrum': 'Typically, voices perceived as female have brighter resonance and higher pitch (top right), while those perceived as male have darker resonance and lower pitch (bottom left). These features can be blended in different degrees to create a <strong>broad spectrum</strong> of perceptual and aesthetic qualities related to gender. There are no sharp cutoffs at which a voice is guaranteed to be gendered a specific way, just as the colors in the graph blend seamlessly into one another.',
		'help.usage': 'Press the <strong>play button</strong> in the top-left corner of the app to play the clip associated with the selected point on the graph. Examine some of the provided examples to get a sense of how positions on the graph correspond to your perceptions of gender. (Note: Example clips may take some time to show up on slow connections). You can visualize your own recordings by pressing the <strong>add clip button</strong> in the top-right and submitting a recording. It will take some time to process, so you may wish to examine the other clips while the recording is processed.',
		'help.privacy': 'Your clips are sent to our server for processing, but they are <strong>not stored persistently</strong>. You can save the sound file from your recording using the <strong>download button</strong> in the "Details" tab. From the settings tab, you can also <strong>export</strong> all of your data in a single file which can be imported for viewing at another time. Otherwise, your data will be lost when you exit the page.',
		'help.closing': 'We hope that using this program will help you understand how voices are gendered and assess your own progress if you are trying to alter your voice to better match your gender identity or desired presentation. Good luck!',
		'help.faq': 'FAQ',
		'help.faq1.q': 'Why does the marker move around so much even when I\u2019m not changing my voice drastically?',
		'help.faq1.a': 'Most speech has a broad range of values in pitch and resonance, e.g. the highest and brightest phone spoken in a sample of typical male speech may well be similar in pitch and resonance to the <em>average</em> phone in typical female speech. Our perception of a voice is based on the overall tendencies within speech rather than the moment-to-moment features of individual phones.',
		'help.faq2.q': 'Why do all the markers start so close together?',
		'help.faq2.a': 'When not playing, the markers are displayed at the median values across the whole clip. Because there\u2019s a wide range of values in most speech, this pushes the median towards the center. However, a small change in median values can have a big influence on how a voice is gendered.',
		'help.faq3.q': 'Does this program support languages other than English?',
		'help.faq3.a': 'Yes. English and Mandarin Chinese are both supported \u2014 select your language in the "Add a Clip" dialog. Other languages may still produce output but with reduced accuracy.',
		'help.faq4.q': 'Do accent and dialect affect pitch and resonance?',
		'help.faq4.a': 'Yes, so you may wish to upload recordings of other speakers with your accent or dialect to better compare with your own voice.',
		'help.faq5.q': 'Ok, I can see my resonance now, but how do I actually change it?',
		'help.faq5.a1': 'There are several ways. One is to raise (brightening) or lower (darkening) your larynx. Your larynx raises when you swallow and lowers when you yawn. You may be able to feel it move if you put your hand over the front of your neck while you make one of these movements. If you can learn to control your larynx position in normal speech, it can have a big effect on your resonance.',
		'help.faq5.a2': 'Your resonance is also affected by the space in your mouth. Holding your tongue higher in your mouth as you speak will brighten your resonance, and holding it lower will darken it.',
		'help.faq6.q': 'Even though my pitch and resonance seem to be in the right spot, I don\u2019t feel like my voice sounds like I want it to.',
		'help.faq6.a': 'There are many dimensions to voice other than pitch and resonance, so you might need to target other features. You might also be straining to reach a particular point, which can be audible to a listener. It might help to pick a less extreme target which you can reach comfortably.',
		'help.credits': 'Credits',
		'help.creditsBody': 'This application is developed by <a href="https://lmcnulty.me">Luna McNulty</a> as part of a research project for her Sc. M. program at Brown University. Its content is available under <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a> and uses Creative-Commons-licensed sound files from Morgan and Christine Lemmer-Webber\u2019s podcast <a href="https://fossandcrafts.org">Foss and Crafts</a> as well as public domain audiobook content from <a href="https://librivox.org">Librivox</a>.',

		'newClip.heading': 'Add a Clip',
		'newClip.title': 'Title',
		'newClip.color': 'Color',
		'newClip.language': 'Language',
		'newClip.script': 'Script',
		'newClip.uploadFile': 'Upload a file',
		'newClip.recordVoice': 'Record your voice',
		'newClip.start': '\u23FA\uFE0E Start',
		'newClip.stop': '\u23F9\uFE0E Stop',
		'newClip.recordedPrefix': 'Recorded',
		'newClip.recordedSuffix': 'seconds',
		'newClip.submit': 'Add Clip',

		'alert.recordingHttps': "Sorry, something went wrong. Please ensure that your microphone is connected and that your browser allows us to record from it. Alternately, you can try uploading a file recorded from a native app instead.",
		'alert.recordingHttp': "Recording in-browser is only available when accessing the site over a secure connection. To record, reload the page ensuring that the URL starts with 'https', including the 's' at the end.",
		'alert.stopRecordingFirst': 'Please stop the recording before submitting.',
		'alert.uploadOrRecord': 'Please upload a file or make a recording.',
		'alert.processFailed': "Sorry, we weren't able to process your recording. Make sure to speak clearly and ensure that your transcript matches the audio. For increased chance of success, try using short clips with a 1-second period of silence.",
		'alert.unknown': 'An unknown error occured.',

		'graph.pitchUnit': 'Hz',
		'graph.percentUnit': '%',
	},
	zh: {
		'app.title': '\u58F0\u5B66\u6027\u522B\u7A7A\u95F4\u53EF\u89C6\u5316 - \u7814\u7A76\u6D4B\u8BD5\u7248',
		'header.clip': '\u7247\u6BB5',
		'header.newClip': '\u65B0\u589E\u7247\u6BB5',
		'header.adding': '\u6B63\u5728\u6DFB\u52A0\u7247\u6BB5\u2026',
		'header.switchLang': '\u5207\u6362\u8BED\u8A00',
		'header.playPause': '\u64AD\u653E / \u6682\u505C',

		'tab.details': '\u8BE6\u60C5',
		'tab.help': '\u5E2E\u52A9',
		'tab.settings': '\u8BBE\u7F6E',

		'details.heading': '\u7247\u6BB5\u8BE6\u60C5',
		'details.instructions': '\u4ECE\u56FE\u4E2D\u9009\u62E9\u4E00\u4E2A\u7247\u6BB5\u6216\u70B9\u4F4D\uFF0C\u5176\u8BE6\u60C5\u4F1A\u5728\u8FD9\u91CC\u663E\u793A\u3002\u5982\u679C\u9875\u9762\u521A\u52A0\u8F7D\u3001\u770B\u5230\u8FD9\u6BB5\u6587\u5B57\uFF0C\u8BF4\u660E\u6D4F\u89C8\u5668\u6B63\u5728\u4E0B\u8F7D\u793A\u4F8B\uFF0C\u4E0B\u8F7D\u5B8C\u6210\u540E\u4F1A\u9646\u7EED\u51FA\u73B0\u3002\u7F51\u7EDC\u8F83\u6162\u65F6\uFF0C\u53EF\u4EE5\u5148\u5728\u201C\u5E2E\u52A9\u201D\u9875\u9605\u8BFB\u4F7F\u7528\u8BF4\u660E\u3002',
		'details.deleteConfirm': '\u518D\u6309\u4E00\u6B21\u4EE5\u5220\u9664',
		'details.deleteTitle': '\u5220\u9664\u7247\u6BB5',
		'details.downloadTitle': '\u4E0B\u8F7D\u7247\u6BB5',
		'details.mean': '\u5747\u503C',
		'details.median': '\u4E2D\u4F4D\u6570',
		'details.stdev': '\u6807\u51C6\u5DEE',
		'details.pitch': '\u97F3\u9AD8',
		'details.resonance': '\u5171\u632F',
		'details.transcript': '\u8F6C\u5199\u6587\u672C',
		'details.advanced': '\u9AD8\u7EA7',
		'details.dlJson': '\u4E0B\u8F7D JSON',
		'details.stdevNote': '* \u5728\u5F88\u591A\u8BED\u5883\u4E2D\uFF0C\u97F3\u9AD8\u53D8\u5316\u8F83\u5927\uFF08\u6807\u51C6\u5DEE\u9AD8\uFF09\u5E38\u4E0E\u5973\u6027\u8BED\u97F3\u76F8\u5173\uFF0C\u800C\u5355\u8C03\u4F4E\u8D77\u4F0F\u5E38\u4E0E\u7537\u6027\u8BED\u97F3\u76F8\u5173\u3002',

		'settings.yourData': '\u4F60\u7684\u6570\u636E',
		'settings.export': '\u5BFC\u51FA',
		'settings.import': '\u5BFC\u5165',
		'settings.examples': '\u793A\u4F8B',
		'settings.reloadDefaults': '\u91CD\u7F6E\u4E3A\u9ED8\u8BA4',
		'settings.loadExtended': '\u52A0\u8F7D\u6269\u5C55\u96C6',
		'settings.extendedWarn': '\u63D0\u793A\uFF1A\u6269\u5C55\u793A\u4F8B\u96C6\u53EF\u80FD\u6D88\u8017\u8F83\u591A\u6D41\u91CF\u3002',
		'settings.theme': '\u4E3B\u9898',
		'settings.customize': '\u81EA\u5B9A\u4E49',
		'settings.roundedCorners': '\u5706\u89D2\uFF1A',
		'settings.shadowStrength': '\u9634\u5F71\u5F3A\u5EA6\uFF1A',
		'settings.shadowSpread': '\u9634\u5F71\u6269\u6563\uFF1A',
		'settings.highlightStrength': '\u9AD8\u5149\u5F3A\u5EA6\uFF1A',
		'settings.bg': '\u80CC\u666F\u8272',
		'settings.text': '\u6587\u5B57\u8272',
		'settings.chromeColor': '\u6846\u67B6\u8272',
		'settings.chromeBg': '\u6846\u67B6\u80CC\u666F',
		'settings.chromeBorder': '\u6846\u67B6\u8FB9\u6846',
		'settings.accent': '\u5F3A\u8C03\u8272',
		'settings.accentText': '\u5F3A\u8C03\u6587\u5B57',
		'settings.btnColor': '\u6309\u94AE\u8272',
		'settings.btnBg': '\u6309\u94AE\u80CC\u666F',
		'settings.inputColor': '\u8F93\u5165\u6587\u5B57\u8272',
		'settings.inputBg': '\u8F93\u5165\u80CC\u666F',
		'settings.importNoFile': '\u8BF7\u9009\u62E9\u4E00\u4E2A\u5305\u542B\u4F60\u5BFC\u51FA\u6570\u636E\u7684\u6587\u4EF6\u3002',

		'help.tutorial': '\u4F7F\u7528\u6559\u7A0B',
		'help.mobileTip': '\u79FB\u52A8\u7AEF\u63D0\u793A\uFF1A\u70B9\u51FB\u672C\u9762\u677F\u9876\u90E8\u53EF\u4EE5\u5C55\u5F00 / \u6536\u8D77\uFF0C\u4FBF\u4E8E\u9605\u8BFB\u3002',
		'help.intro': '\u672C\u5E94\u7528\u5C06\u5F55\u97F3\u4E2D\u8BED\u97F3\u968F\u65F6\u95F4\u53D8\u5316\u7684\u3010\u97F3\u9AD8\u3011\u4E0E\u3010\u5171\u632F\u3011\u53EF\u89C6\u5316\u3002<strong>\u97F3\u9AD8</strong>\u662F\u6211\u4EEC\u5BF9\u58F0\u5E26\u632F\u52A8\u9891\u7387\u7684\u611F\u77E5\uFF0C<strong>\u5171\u632F</strong>\u5219\u662F\u58F0\u97F3\u5728\u53E3\u8154\u3001\u54BD\u8154\u4E2D\u4F20\u9012\u65F6\u53D7\u5230\u7684\u5F71\u54CD\u3002\u7A0B\u5E8F\u5728\u4E00\u4E2A<strong>\u4E8C\u7EF4\u5E73\u9762</strong>\u5185\u7ED8\u5236\u5F55\u97F3\uFF1AY \u8F74\u8868\u793A\u97F3\u9AD8\uFF0CX \u8F74\u8868\u793A\u5171\u632F\uFF0C\u8F83\u660E\u4EAE\u7684\u58F0\u97F3\u5BF9\u5E94\u8F83\u9AD8\u7684\u767E\u5206\u6BD4\u3002',
		'help.spectrum': '\u4E00\u822C\u6765\u8BF4\uFF0C\u88AB\u542C\u4F5C\u5973\u6027\u7684\u58F0\u97F3\u5171\u632F\u8F83\u660E\u4EAE\u3001\u97F3\u9AD8\u8F83\u9AD8\uFF08\u53F3\u4E0A\uFF09\uFF1B\u88AB\u542C\u4F5C\u7537\u6027\u7684\u58F0\u97F3\u5171\u632F\u8F83\u6697\u3001\u97F3\u9AD8\u8F83\u4F4E\uFF08\u5DE6\u4E0B\uFF09\u3002\u8FD9\u4E9B\u7279\u5F81\u53EF\u4EE5\u4EE5\u4E0D\u540C\u7A0B\u5EA6\u6DF7\u5408\uFF0C\u5F62\u6210\u4E00\u4E2A\u4E0E\u6027\u522B\u76F8\u5173\u7684<strong>\u8FDE\u7EED\u5149\u8C31</strong>\uFF0C\u5E76\u4E0D\u5B58\u5728\u4E00\u4E2A\u660E\u786E\u7684\u5206\u754C\u3002',
		'help.usage': '\u70B9\u51FB\u5DE6\u4E0A\u89D2\u7684<strong>\u64AD\u653E\u6309\u94AE</strong>\u53EF\u4EE5\u64AD\u653E\u9009\u4E2D\u70B9\u5BF9\u5E94\u7684\u7247\u6BB5\u3002\u53EF\u4EE5\u5148\u542C\u542C\u51E0\u4E2A\u793A\u4F8B\uFF0C\u611F\u53D7\u4E0D\u540C\u4F4D\u7F6E\u5BF9\u5E94\u7684\u4E0D\u540C\u542C\u611F\uFF08\u793A\u4F8B\u53EF\u80FD\u9700\u8981\u4E00\u4E9B\u65F6\u95F4\u624D\u80FD\u52A0\u8F7D\u5B8C\u6BD5\uFF09\u3002\u70B9\u51FB\u53F3\u4E0A\u89D2\u7684<strong>\u65B0\u589E\u6309\u94AE</strong>\u4E0A\u4F20\u4F60\u81EA\u5DF1\u7684\u5F55\u97F3\u8FDB\u884C\u53EF\u89C6\u5316\u3002\u5904\u7406\u9700\u8981\u4E00\u4E9B\u65F6\u95F4\uFF0C\u53EF\u4EE5\u4E00\u8FB9\u7B49\u4E00\u8FB9\u7FFB\u9605\u5176\u4ED6\u7247\u6BB5\u3002',
		'help.privacy': '\u4F60\u7684\u5F55\u97F3\u4F1A\u88AB\u53D1\u9001\u5230\u670D\u52A1\u5668\u5904\u7406\uFF0C<strong>\u4F46\u4E0D\u4F1A\u6301\u4E45\u4FDD\u5B58</strong>\u3002\u53EF\u4EE5\u5728\u201C\u8BE6\u60C5\u201D\u9875\u70B9\u51FB<strong>\u4E0B\u8F7D\u6309\u94AE</strong>\u4FDD\u5B58\u5F55\u97F3\u6587\u4EF6\uFF1B\u6216\u8005\u5728\u201C\u8BBE\u7F6E\u201D\u9875<strong>\u5BFC\u51FA</strong>\u6240\u6709\u6570\u636E\u4EE5\u4FBF\u4E0B\u6B21\u5BFC\u5165\u67E5\u770B\u3002\u5426\u5219\u5173\u95ED\u9875\u9762\u540E\u6570\u636E\u5C06\u4E22\u5931\u3002',
		'help.closing': '\u5E0C\u671B\u672C\u7A0B\u5E8F\u80FD\u5E2E\u52A9\u4F60\u7406\u89E3\u8BED\u97F3\u4E2D\u7684\u6027\u522B\u8868\u73B0\uFF0C\u5E76\u8BC4\u4F30\u5728\u8C03\u6574\u58F0\u97F3\u3001\u5339\u914D\u6027\u522B\u8EAB\u4EFD\u6216\u671F\u671B\u4E2D\u7684\u8FDB\u5C55\u3002\u795D\u987A\u5229\uFF01',
		'help.faq': '\u5E38\u89C1\u95EE\u9898',
		'help.faq1.q': '\u4E3A\u4EC0\u4E48\u6211\u5C31\u7B97\u6CA1\u5927\u5E45\u53D8\u58F0\uFF0C\u6807\u8BB0\u4E5F\u5728\u5728\u56FE\u4E2D\u5230\u5904\u8DF3\uFF1F',
		'help.faq1.a': '\u5927\u591A\u6570\u8BED\u97F3\u5728\u97F3\u9AD8\u548C\u5171\u632F\u4E0A\u90FD\u5E45\u5EA6\u8F83\u5927\u3002\u4F8B\u5982\u4E00\u6BB5\u201C\u5178\u578B\u7537\u58F0\u201D\u4E2D\u6700\u9AD8\u3001\u6700\u4EAE\u7684\u4E00\u4E2A\u97F3\u7D20\uFF0C\u53EF\u80FD\u4E0E\u4E00\u6BB5\u201C\u5178\u578B\u5973\u58F0\u201D\u7684<em>\u5E73\u5747</em>\u97F3\u7D20\u63A5\u8FD1\u3002\u6211\u4EEC\u5BF9\u58F0\u97F3\u6027\u522B\u7684\u611F\u77E5\u53D6\u51B3\u4E8E\u6574\u4F53\u503E\u5411\uFF0C\u800C\u4E0D\u662F\u67D0\u4E2A\u77AC\u95F4\u3002',
		'help.faq2.q': '\u4E3A\u4EC0\u4E48\u6240\u6709\u6807\u8BB0\u4E00\u5F00\u59CB\u90FD\u96C6\u4E2D\u5728\u4E2D\u95F4\uFF1F',
		'help.faq2.a': '\u672A\u64AD\u653E\u65F6\u6807\u8BB0\u663E\u793A\u7684\u662F\u6574\u6BB5\u7247\u6BB5\u7684\u4E2D\u4F4D\u6570\u3002\u7531\u4E8E\u8BED\u97F3\u672C\u8EAB\u5E45\u5EA6\u8F83\u5927\uFF0C\u4E2D\u4F4D\u6570\u4F1A\u88AB\u201C\u62C9\u201D\u5411\u4E2D\u95F4\uFF0C\u4F46\u4E2D\u4F4D\u6570\u7684\u4E00\u70B9\u70B9\u53D8\u5316\u4ECD\u4F1A\u660E\u663E\u5F71\u54CD\u542C\u611F\u3002',
		'help.faq3.q': '\u8FD9\u4E2A\u7A0B\u5E8F\u652F\u6301\u82F1\u8BED\u4EE5\u5916\u7684\u8BED\u8A00\u5417\uFF1F',
		'help.faq3.a': '\u652F\u6301\u3002\u76EE\u524D\u5DF2\u652F\u6301\u82F1\u8BED\u548C\u666E\u901A\u8BDD\uFF0C\u5728\u201C\u65B0\u589E\u7247\u6BB5\u201D\u5BF9\u8BDD\u6846\u9009\u62E9\u8BED\u8A00\u5373\u53EF\u3002\u5176\u4ED6\u8BED\u8A00\u4E5F\u53EF\u80FD\u6709\u8F93\u51FA\uFF0C\u4F46\u51C6\u786E\u5EA6\u4F1A\u4E0B\u964D\u3002',
		'help.faq4.q': '\u53E3\u97F3\u3001\u65B9\u8A00\u4F1A\u5F71\u54CD\u97F3\u9AD8\u548C\u5171\u632F\u5417\uFF1F',
		'help.faq4.a': '\u4F1A\u3002\u53EF\u4EE5\u4E0A\u4F20\u4E00\u4E9B\u4E0E\u4F60\u53E3\u97F3 / \u65B9\u8A00\u76F8\u8FD1\u7684\u8BF4\u8BDD\u4EBA\u7684\u5F55\u97F3\u4F5C\u4E3A\u53C2\u8003\u3002',
		'help.faq5.q': '\u73B0\u5728\u80FD\u770B\u5230\u5171\u632F\u4E86\uFF0C\u8BE5\u600E\u4E48\u8C03\u8282\u5B83\uFF1F',
		'help.faq5.a1': '\u6709\u51E0\u79CD\u65B9\u6CD5\u3002\u4E00\u662F\u63A7\u5236\u5589\u90E8\u4F4D\u7F6E\uFF1A\u5589\u90E8\u4E0A\u63D0\u4F1A\u8BA9\u5171\u632F\u53D8\u4EAE\uFF0C\u4E0B\u964D\u4F1A\u8BA9\u5171\u632F\u53D8\u6697\u3002\u541E\u54BD\u65F6\u5589\u4F1A\u4E0A\u63D0\uFF0C\u6253\u54C8\u6B20\u65F6\u4F1A\u4E0B\u964D\uFF0C\u53EF\u4EE5\u628A\u624B\u653E\u5728\u8116\u5B50\u524D\u90E8\u611F\u53D7\u8FD9\u79CD\u79FB\u52A8\u3002\u80FD\u591F\u5728\u6B63\u5E38\u8BF4\u8BDD\u4E2D\u63A7\u5236\u5589\u4F4D\uFF0C\u5C31\u80FD\u660E\u663E\u6539\u53D8\u5171\u632F\u3002',
		'help.faq5.a2': '\u53E3\u8154\u7A7A\u95F4\u4E5F\u4F1A\u5F71\u54CD\u5171\u632F\uFF1A\u820C\u4F4D\u504F\u9AD8\u4F1A\u8BA9\u5171\u632F\u53D8\u4EAE\uFF0C\u820C\u4F4D\u504F\u4F4E\u4F1A\u8BA9\u5171\u632F\u53D8\u6697\u3002',
		'help.faq6.q': '\u97F3\u9AD8\u548C\u5171\u632F\u770B\u8D77\u6765\u90FD\u5BF9\uFF0C\u4F46\u603B\u89C9\u5F97\u58F0\u97F3\u4E0D\u662F\u81EA\u5DF1\u60F3\u8981\u7684\u6837\u5B50\u3002',
		'help.faq6.a': '\u8BED\u97F3\u9664\u4E86\u97F3\u9AD8\u548C\u5171\u632F\u8FD8\u6709\u5F88\u591A\u7EF4\u5EA6\uFF0C\u53EF\u80FD\u9700\u8981\u8C03\u6574\u5176\u4ED6\u7279\u5F81\u3002\u53E6\u5916\u4E5F\u53EF\u80FD\u662F\u4F60\u4E3A\u4E86\u8FBE\u5230\u67D0\u4E2A\u70B9\u800C\u8FC7\u5EA6\u7528\u529B\uFF0C\u542C\u4F17\u80FD\u542C\u51FA\u6765\u3002\u9009\u4E2A\u4F60\u8F7B\u677E\u80FD\u8FBE\u5230\u7684\u6CA1\u90A3\u4E48\u6781\u7AEF\u7684\u76EE\u6807\u4F1A\u66F4\u597D\u3002',
		'help.credits': '\u9E23\u8C22',
		'help.creditsBody': '\u672C\u5E94\u7528\u7531 <a href="https://lmcnulty.me">Luna McNulty</a> \u4F5C\u4E3A\u5176\u5728\u5E03\u6717\u5927\u5B66 Sc.M. \u9879\u76EE\u7684\u7814\u7A76\u9879\u76EE\u5F00\u53D1\u3002\u5185\u5BB9\u4F7F\u7528 <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a> \u8BB8\u53EF\u3002\u793A\u4F8B\u97F3\u9891\u6765\u81EA Morgan \u548C Christine Lemmer-Webber \u7684\u64AD\u5BA2 <a href="https://fossandcrafts.org">Foss and Crafts</a>\uFF0C\u4EE5\u53CA <a href="https://librivox.org">Librivox</a> \u7684\u516C\u6709\u9886\u57DF\u6709\u58F0\u4E66\u5185\u5BB9\u3002',

		'newClip.heading': '\u65B0\u589E\u7247\u6BB5',
		'newClip.title': '\u6807\u9898',
		'newClip.color': '\u989C\u8272',
		'newClip.language': '\u8BED\u8A00',
		'newClip.script': '\u811A\u672C',
		'newClip.uploadFile': '\u4E0A\u4F20\u6587\u4EF6',
		'newClip.recordVoice': '\u5F55\u5236\u8BED\u97F3',
		'newClip.start': '\u23FA\uFE0E \u5F00\u59CB',
		'newClip.stop': '\u23F9\uFE0E \u505C\u6B62',
		'newClip.recordedPrefix': '\u5DF2\u5F55',
		'newClip.recordedSuffix': '\u79D2',
		'newClip.submit': '\u6DFB\u52A0\u7247\u6BB5',

		'alert.recordingHttps': '\u62B1\u6B49\uFF0C\u5F55\u97F3\u51FA\u9519\u4E86\u3002\u8BF7\u786E\u8BA4\u9EA6\u514B\u98CE\u5DF2\u8FDE\u63A5\u4E14\u6D4F\u89C8\u5668\u5141\u8BB8\u672C\u7AD9\u5F55\u97F3\uFF1B\u4E5F\u53EF\u4EE5\u6539\u4E3A\u4E0A\u4F20\u539F\u751F\u5E94\u7528\u5F55\u5236\u7684\u97F3\u9891\u6587\u4EF6\u3002',
		'alert.recordingHttp': '\u6D4F\u89C8\u5668\u5F55\u97F3\u4EC5\u5728 HTTPS \u5B89\u5168\u8FDE\u63A5\u4E0B\u53EF\u7528\u3002\u8BF7\u91CD\u65B0\u52A0\u8F7D\u9875\u9762\uFF0C\u786E\u4FDD\u5730\u5740\u4EE5 https \u5F00\u5934\u3002',
		'alert.stopRecordingFirst': '\u8BF7\u5148\u505C\u6B62\u5F55\u97F3\u518D\u63D0\u4EA4\u3002',
		'alert.uploadOrRecord': '\u8BF7\u4E0A\u4F20\u4E00\u4E2A\u6587\u4EF6\u6216\u5F55\u4E00\u6BB5\u97F3\u9891\u3002',
		'alert.processFailed': '\u62B1\u6B49\uFF0C\u672A\u80FD\u5904\u7406\u8FD9\u6BB5\u5F55\u97F3\u3002\u8BF7\u8BD5\u7740\u5410\u5B57\u6E05\u6670\uFF0C\u5E76\u786E\u4FDD\u8F6C\u5199\u6587\u672C\u4E0E\u97F3\u9891\u4E00\u81F4\u3002\u4F7F\u7528\u8F83\u77ED\u7684\u7247\u6BB5\u5E76\u9884\u7559 1 \u79D2\u5DE6\u53F3\u7684\u9759\u9ED8\u53EF\u63D0\u9AD8\u6210\u529F\u7387\u3002',
		'alert.unknown': '\u53D1\u751F\u4E86\u672A\u77E5\u9519\u8BEF\u3002',

		'graph.pitchUnit': 'Hz',
		'graph.percentUnit': '%',
	},
};

function getLang() {
	return 'zh';
}

function t(key, params) {
	let str = I18N.zh[key];
	if (str === undefined) {
		console.warn('[i18n] missing key:', key);
		return key;
	}
	if (params) {
		for (let k in params) str = str.split('{' + k + '}').join(params[k]);
	}
	return str;
}

function applyI18n(root) {
	root = root || document;
	let html = root.documentElement || document.documentElement;
	if (html) html.setAttribute('lang', 'zh-CN');
	let nodes = root.querySelectorAll ? root.querySelectorAll('[data-i18n]') : [];
	nodes.forEach(el => {
		let key = el.getAttribute('data-i18n');
		let mode = el.getAttribute('data-i18n-mode') || 'html';
		let val = t(key);
		if (mode === 'text') el.textContent = val;
		else el.innerHTML = val;
	});
	let attrNodes = root.querySelectorAll ? root.querySelectorAll('[data-i18n-attr]') : [];
	attrNodes.forEach(el => {
		let spec = el.getAttribute('data-i18n-attr');
		spec.split(',').forEach(pair => {
			let [attr, key] = pair.split(':').map(s => s && s.trim());
			if (attr && key) el.setAttribute(attr, t(key));
		});
	});
	let titleEl = (root.ownerDocument || document).querySelector('title[data-i18n]');
	if (titleEl) document.title = titleEl.textContent;
}

function setLang(_lang) { /* 中文单语：保留占位以防外部调用 */ }
function toggleLang() { /* 中文单语：语言切换已移除 */ }
