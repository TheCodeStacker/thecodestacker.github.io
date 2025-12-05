import { supportedLangs } from '../config/languages.js';
import { errorHandler } from './errorHandler.js';

class State {
	constructor() {
		this.currentLang = 'en';
		this.listeners = [];
	}

	init() {
		try {
			const browserLang = navigator.language || navigator.userLanguage || 'en';
			this.currentLang = browserLang.startsWith('id') ? 'id' : 'en';
		} catch (error) {
			errorHandler.handleError(error, {
				type: 'state_init',
				location: 'State.init'
			});
			this.currentLang = 'en';
		}
	}

	setLang(lang, skipHashUpdate = false) {
		try {
			const validLang = supportedLangs.includes(lang) ? lang : 'en';
			
			if (validLang !== this.currentLang) {
				this.currentLang = validLang;
				if (!skipHashUpdate) this.updateHash();
				this.notify();
			}
		} catch (error) {
			errorHandler.handleError(error, {
				type: 'state_set_lang',
				location: 'State.setLang',
				lang,
				skipHashUpdate
			});
		}
	}

	getLang() {
		return this.currentLang;
	}

	updateHash() {
		try {
			const hash = window.location.hash.slice(1) || 'index';
			const [page] = hash.split('?');
			const lang = this.currentLang;
			window.location.hash = `${page}${lang !== 'en' ? '?lang=' + lang : ''}`;
		} catch (error) {
			errorHandler.handleError(error, {
				type: 'state_update_hash',
				location: 'State.updateHash',
				currentLang: this.currentLang
			});
		}
	}

	subscribe(listener) {
		try {
			if (typeof listener !== 'function') {
				throw new Error('Listener must be a function');
			}
			this.listeners.push(listener);
			return () => {
				const index = this.listeners.indexOf(listener);
				if (index > -1) {
					this.listeners.splice(index, 1);
				}
			};
		} catch (error) {
			errorHandler.handleError(error, {
				type: 'state_subscribe',
				location: 'State.subscribe'
			});
			return () => {};
		}
	}

	notify() {
		try {
			this.listeners.forEach(fn => {
				try {
					fn(this.currentLang);
				} catch (error) {
					errorHandler.handleError(error, {
						type: 'state_notify_listener',
						location: 'State.notify'
					});
				}
			});
		} catch (error) {
			errorHandler.handleError(error, {
				type: 'state_notify',
				location: 'State.notify'
			});
		}
	}
}

export const state = new State();