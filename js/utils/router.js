import { loadDataFile } from './dataLoader.js';
import { applyStyles, cleanup as cleanupStyles } from './styles.js';
import { renderHeader } from '../components/header.js';
import { state } from './state.js';
import { errorHandler } from './errorHandler.js';

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
		try {
			cleanupRouterEvents();
			this.navigate();
			
			eventHandlers.hashChangeHandler = () => this.navigate();
			window.addEventListener('hashchange', eventHandlers.hashChangeHandler);
			
			this.setupLinkHandler();
			stateUnsubscribe = state.subscribe(() => this.navigate());
		} catch (error) {
			errorHandler.handleError(error, {
				type: 'router_init',
				location: 'Router.init'
			});
		}
	}
	
	parseHash() {
		try {
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
		} catch (error) {
			errorHandler.handleError(error, {
				type: 'parse_hash',
				location: 'Router.parseHash',
				hash: window.location.hash
			});
			return { page: 'terms-index', lang: 'en' };
		}
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
				throw new Error(`Failed to load page: ${page}`);
			}
			
			this.render(data);
			
		} catch (error) {
			errorHandler.handleError(error, {
				type: 'navigation',
				location: 'Router.navigate',
				page: this.parseHash().page
			});
			
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
		try {
			const el = document.getElementById('content');
			if (!el) throw new Error('Content element not found');
			
			renderHeader(data);
			el.innerHTML = '<div class="px-4 py-6 animate-fadeIn" id="terms-content"></div>';
			
			const content = document.getElementById('terms-content');
			if (!content) throw new Error('Terms content element not found');
			
			content.innerHTML = marked.parse(data.content);
			applyStyles(content);
			this.processLinks(content);
			requestAnimationFrame(() => feather?.replace());
		} catch (error) {
			errorHandler.handleError(error, {
				type: 'render',
				location: 'Router.render',
				dataTitle: data?.title
			});
		}
	}
	
	processLinks(container) {
		try {
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
		} catch (error) {
			errorHandler.handleError(error, {
				type: 'process_links',
				location: 'Router.processLinks'
			});
		}
	}
	
	setupLinkHandler() {
		try {
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
		} catch (error) {
			errorHandler.handleError(error, {
				type: 'setup_link_handler',
				location: 'Router.setupLinkHandler'
			});
		}
	}
	
	destroy() {
		cleanupRouterEvents();
	}
}

export const router = new Router();

export function cleanupRouter() {
	router.destroy();
}