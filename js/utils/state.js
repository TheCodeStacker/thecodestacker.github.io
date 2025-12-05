import { supportedLangs } from '../config/languages.js';

class State {
	constructor() {
		this.currentLang = 'en';
		this.listeners = [];
	}

	init() {
		const browserLang = navigator.language || navigator.userLanguage || 'en';
		this.currentLang = browserLang.startsWith('id') ? 'id' : 'en';
	}

	setLang(lang, skipHashUpdate = false) {
		const validLang = supportedLangs.includes(lang) ? lang : 'en';
		
		if (validLang !== this.currentLang) {
			this.currentLang = validLang;
			if (!skipHashUpdate) this.updateHash();
			this.notify();
		}
	}

	getLang() {
		return this.currentLang;
	}

	updateHash() {
		const hash = window.location.hash.slice(1) || 'index';
		const [page] = hash.split('?');
		const lang = this.currentLang;
		window.location.hash = `${page}${lang !== 'en' ? '?lang=' + lang : ''}`;
	}

	subscribe(listener) {
		if (typeof listener !== 'function') return () => {};
		
		this.listeners.push(listener);
		return () => {
			const index = this.listeners.indexOf(listener);
			if (index > -1) {
				this.listeners.splice(index, 1);
			}
		};
	}

	notify() {
		this.listeners.forEach(fn => {
			fn(this.currentLang);
		});
	}
}

export const state = new State();