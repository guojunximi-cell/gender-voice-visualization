
const resizeEvent = evt => {
	if (window.innerWidth / window.innerHeight > 1.4) {
		document.body.classList.remove('narrow-body');
		document.body.classList.add('wide-body');
	} else {
		document.body.classList.add('narrow-body');
		document.body.classList.remove('wide-body');
	}
	let vgEl = $('voice-graph-2d');
	let vgParent = vgEl.parentNode;
	vgEl.style.maxWidth = getComputedStyle(vgParent).height;
}

window.onload = resizeEvent;
window.addEventListener('resize', resizeEvent);

$('.play-pause').focus();

$('button.details').click();

// i18n: apply translations after all DOM is in place, sync lang-select to UI lang.
applyI18n();
(function syncLangSelectInit() {
	let langSelect = $('#lang-select');
	if (!langSelect) return;
	langSelect.value = getLang();
	langSelect.addEventListener('change', evt => {
		let v = langSelect.value;
		if ((v === 'en' || v === 'zh') && v !== getLang()) setLang(v);
	});
	if (typeof filterScriptsByLang === 'function') filterScriptsByLang(getLang());
})();
window.addEventListener('langchange', () => {
	let prev = globalState.get('previewClip');
	if (prev) { globalState.set('previewClip', null); globalState.set('previewClip', prev); }
});

for (let el of $$('textarea, input')) {
	el.addEventListener('focusin', resizeEvent);
	el.addEventListener('focusout', resizeEvent);
}

loadDefaultClips();
