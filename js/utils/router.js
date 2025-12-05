import { loadDataFile } from './dataLoader.js';
import { applyStyles, cleanup as cleanupStyles } from './styles.js';
import { renderHeader } from '../components/header.js';
import { state } from './state.js';

let eventHandlers = {
	hashChangeHandler: null,
	documentClickHandler: null,
	linkClickHandlers: new WeakMap()
};

let stateUnsubscribe = null;
let isNavigating = false;

function cleanupRouterEvents() {
	if (eventHandlers.hashChangeHandler) {
		window.removeEventListener('hashchange', eventHandlers.hashChangeHandler);
		eventHandlers.hashChangeHandler = null;
	}
	
	if (eventHandlers.documentClickHandler) {
		document.removeEventListener('click', eventHandlers.documentClickHandler);
		eventHandlers.documentClickHandler = null;
	}
	
	eventHandlers.linkClickHandlers = new WeakMap();
	cleanupStyles();
	
	if (stateUnsubscribe) {
		stateUnsubscribe();
		stateUnsubscribe = null;
	}
}

class Router {
	init() {
		cleanupRouterEvents();
		this.navigate();
		
		eventHandlers.hashChangeHandler = () => this.navigate();
		window.addEventListener('hashchange', eventHandlers.hashChangeHandler);
		
		this.setupLinkHandler();
		stateUnsubscribe = state.subscribe(() => this.navigate());
	}
	
	parseHash() {
		let hash = window.location.hash.slice(1);
		
		if (!hash) {
			const currentLang = state.getLang();
			const query = currentLang !== 'en' ? `?lang=${currentLang}` : '';
			window.location.hash = `terms-index${query}`;
			return { page: 'terms-index', lang: currentLang };
		}
		
		const [path, query] = hash.split('?');
		const params = new URLSearchParams(query || '');
		return { page: path || 'terms-index', lang: params.get('lang') };
	}
	
	async navigate() {
		if (isNavigating) return;
		isNavigating = true;
		
		window.scrollTo({ top: 0, behavior: 'smooth' });
		
		const { page, lang } = this.parseHash();
		
		if (lang && lang !== state.getLang()) {
			state.setLang(lang, true);
			isNavigating = false;
			return;
		}
		
		const data = await loadDataFile(page);
		
		if (!data) {
			const currentLang = state.getLang();
			const query = currentLang !== 'en' ? `?lang=${currentLang}` : '';
			window.location.hash = `terms-index${query}`;
			isNavigating = false;
			return;
		}
		
		this.render(data);
		isNavigating = false;
	}
	
	render(data) {
		const element = document.getElementById('content');
		if (!element) return;
		
		renderHeader(data);
		element.innerHTML = '<div class="px-4 py-6" id="terms-content"></div>';
		
		const content = document.getElementById('terms-content');
		if (!content) return;
		
		content.innerHTML = marked.parse(data.content);
		applyStyles(content);
		this.processLinks(content);
		requestAnimationFrame(() => {
			if (typeof feather !== 'undefined' && feather.replace) {
				feather.replace();
			}
		});
	}
	
	processLinks(container) {
		container.querySelectorAll('a').forEach(link => {
			const href = link.getAttribute('href');
			if (!href) return;
			
			const oldHandler = eventHandlers.linkClickHandlers.get(link);
			if (oldHandler) {
				link.removeEventListener('click', oldHandler);
			}
			
			if (href.startsWith('/')) {
				const handler = event => {
					event.preventDefault();
					const lang = state.getLang();
					const page = href.substring(1);
					window.location.hash = `${page}${lang !== 'en' ? '?lang=' + lang : ''}`;
				};
				
				eventHandlers.linkClickHandlers.set(link, handler);
				link.addEventListener('click', handler);
			} else if (href.startsWith('http')) {
				link.setAttribute('target', '_blank');
				link.setAttribute('rel', 'noopener noreferrer');
			}
		});
	}
	
	setupLinkHandler() {
		eventHandlers.documentClickHandler = event => {
			if (event.target.tagName === 'A') {
				const href = event.target.getAttribute('href');
				if (href?.startsWith('#')) {
					event.preventDefault();
					window.location.hash = href;
				}
			}
		};
		
		document.addEventListener('click', eventHandlers.documentClickHandler);
	}
	
	destroy() {
		cleanupRouterEvents();
	}
}

export const router = new Router();

export function cleanupRouter() {
	router.destroy();
}