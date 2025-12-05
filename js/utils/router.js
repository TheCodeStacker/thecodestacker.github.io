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
		
		try {
			window.scrollTo({ top: 0, behavior: 'smooth' });
			
			const { page, lang } = this.parseHash();
			
			if (lang && lang !== state.getLang()) {
				state.setLang(lang, true);
				return;
			}
			
			this.showLoadingAnimation();
			await new Promise(resolve => setTimeout(resolve, 150));
			
			const data = await loadDataFile(page);
			
			if (!data) {
				const currentLang = state.getLang();
				const query = currentLang !== 'en' ? `?lang=${currentLang}` : '';
				window.location.hash = `terms-index${query}`;
				return;
			}
			
			this.render(data);
			
		} catch (error) {
			console.error('Navigation error:', error);
			const currentLang = state.getLang();
			const query = currentLang !== 'en' ? `?lang=${currentLang}` : '';
			window.location.hash = `terms-index${query}`;
		} finally {
			isNavigating = false;
		}
	}
	
	showLoadingAnimation() {
		const content = document.getElementById('content');
		if (!content) return;
		
		content.innerHTML = `
			<div class="flex items-center justify-center min-h-[400px] animate-fadeIn">
				<div class="text-center">
					<div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
					<p class="text-gray-600 font-medium animate-pulse">Loading...</p>
				</div>
			</div>
		`;
	}
	
	render(data) {
		const el = document.getElementById('content');
		if (!el) return;
		
		renderHeader(data);
		el.innerHTML = '<div class="px-4 py-6 animate-fadeIn" id="terms-content"></div>';
		
		const content = document.getElementById('terms-content');
		if (!content) return;
		
		content.innerHTML = marked.parse(data.content);
		applyStyles(content);
		this.processLinks(content);
		requestAnimationFrame(() => feather?.replace());
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
				const handler = e => {
					e.preventDefault();
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
		eventHandlers.documentClickHandler = e => {
			if (e.target.tagName === 'A') {
				const href = e.target.getAttribute('href');
				if (href?.startsWith('#')) {
					e.preventDefault();
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