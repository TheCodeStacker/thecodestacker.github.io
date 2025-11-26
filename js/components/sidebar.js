import { getDataFiles } from '../utils/dataLoader.js';
import { state } from '../utils/state.js';
import { openLanguageModal } from './languageModal.js';

let isOpen = false;
let eventHandlers = {
	toggleHandler: null,
	closeHandler: null,
	overlayHandler: null,
	headerHandler: null,
	languageHandler: null,
	hashChangeHandler: null,
	sidebarItemHandlers: []
};

function cleanupEventHandlers() {
	const toggle = document.getElementById('sidebar-toggle');
	const close = document.getElementById('sidebar-close');
	const overlay = document.getElementById('sidebar-overlay');
	const header = document.getElementById('sidebar-header');
	const sidebar = document.getElementById('sidebar');
	
	if (toggle && eventHandlers.toggleHandler) {
		toggle.removeEventListener('click', eventHandlers.toggleHandler);
	}
	if (close && eventHandlers.closeHandler) {
		close.removeEventListener('click', eventHandlers.closeHandler);
	}
	if (overlay && eventHandlers.overlayHandler) {
		overlay.removeEventListener('click', eventHandlers.overlayHandler);
	}
	if (header && eventHandlers.headerHandler) {
		header.removeEventListener('click', eventHandlers.headerHandler);
	}
	if (sidebar && eventHandlers.languageHandler) {
		sidebar.removeEventListener('click', eventHandlers.languageHandler);
	}
	if (eventHandlers.hashChangeHandler) {
		window.removeEventListener('hashchange', eventHandlers.hashChangeHandler);
	}
	
	eventHandlers.sidebarItemHandlers.forEach(({ element, handler }) => {
		if (element) element.removeEventListener('click', handler);
	});
	eventHandlers.sidebarItemHandlers = [];
}

export async function renderSidebar() {
	const el = document.getElementById('sidebar');
	
	const render = async () => {
		cleanupEventHandlers();
		
		const files = await getDataFiles();
		const lang = state.getLang();
		const query = lang !== 'en' ? `?lang=${lang}` : '';
		
		const items = files.map(f => `
			<a href="#${f.id}${query}" class="sidebar-item flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 rounded-lg mx-2" data-page="${f.id}">
				<i data-feather="${f.icon}" class="w-5 h-5 flex-shrink-0"></i>
				<span class="font-medium truncate text-sm">${f.title}</span>
			</a>
		`).join('');
		
		el.innerHTML = `
			<button id="sidebar-toggle" class="fixed top-4 right-4 z-50 lg:hidden bg-blue-600 text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all hover:scale-110">
				<i data-feather="menu" class="w-6 h-6"></i>
			</button>
			<div id="sidebar-overlay" class="fixed inset-0 bg-black/50 z-30 lg:hidden hidden transition-opacity duration-300"></div>
			<div id="sidebar-content" class="fixed lg:sticky top-0 left-0 z-40 w-64 bg-white border-r border-gray-200 h-screen flex flex-col transform -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-out">
				<div class="p-4 border-b border-gray-200 flex items-center justify-between gap-2">
					<button id="sidebar-header" class="flex items-center gap-3 hover:opacity-80 lg:cursor-default lg:hover:opacity-100 transition-opacity flex-1 min-w-0">
						<i data-feather="layers" class="w-8 h-8 text-blue-600 flex-shrink-0"></i>
						<h2 class="text-xl font-bold text-gray-900 truncate">Code Stacker</h2>
					</button>
					<button id="sidebar-close" class="lg:hidden text-gray-500 hover:text-gray-700 flex-shrink-0 transition-colors p-1">
						<i data-feather="x" class="w-6 h-6"></i>
					</button>
				</div>
				<div class="px-4 py-6 border-b border-gray-200">
					<button id="language-button" class="w-full flex items-center gap-2 justify-center py-2.5 px-3 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all hover:shadow-lg">
						<i data-feather="globe" class="w-4 h-4"></i>
						<span>Language</span>
					</button>
				</div>
				<nav class="flex-1 overflow-y-auto py-4">${items}</nav>
			</div>
		`;
		
		const toggle = document.getElementById('sidebar-toggle');
		const close = document.getElementById('sidebar-close');
		const overlay = document.getElementById('sidebar-overlay');
		const header = document.getElementById('sidebar-header');
		
		eventHandlers.toggleHandler = () => toggleSidebar(!isOpen);
		eventHandlers.closeHandler = () => toggleSidebar(false);
		eventHandlers.overlayHandler = () => toggleSidebar(false);
		eventHandlers.headerHandler = () => {
			if (window.innerWidth < 1024) toggleSidebar(false);
		};
		
		toggle.addEventListener('click', eventHandlers.toggleHandler);
		close.addEventListener('click', eventHandlers.closeHandler);
		overlay.addEventListener('click', eventHandlers.overlayHandler);
		header.addEventListener('click', eventHandlers.headerHandler);
		
		document.querySelectorAll('.sidebar-item').forEach(item => {
			const handler = () => {
				item.classList.add('animate-scaleIn');
				setTimeout(() => item.classList.remove('animate-scaleIn'), 300);
				
				if (window.innerWidth < 1024) {
					setTimeout(() => toggleSidebar(false), 150);
				}
			};
			eventHandlers.sidebarItemHandlers.push({ element: item, handler });
			item.addEventListener('click', handler);
		});
		
		eventHandlers.languageHandler = (e) => {
			if (e.target.closest('#language-button')) {
				openLanguageModal();
			}
		};
		el.addEventListener('click', eventHandlers.languageHandler);
		
		updateActiveItem();
		feather.replace();
	};
	
	await render();
	
	eventHandlers.hashChangeHandler = updateActiveItem;
	window.addEventListener('hashchange', eventHandlers.hashChangeHandler);
	
	state.subscribe(render);
}

function toggleSidebar(open) {
	isOpen = open;
	const content = document.getElementById('sidebar-content');
	const overlay = document.getElementById('sidebar-overlay');
	
	if (open) {
		content?.classList.remove('-translate-x-full');
		overlay?.classList.remove('hidden');
		setTimeout(() => overlay?.classList.add('opacity-100'), 10);
	} else {
		content?.classList.add('-translate-x-full');
		overlay?.classList.remove('opacity-100');
		setTimeout(() => overlay?.classList.add('hidden'), 300);
	}
}

function updateActiveItem() {
	const hash = window.location.hash.slice(1) || 'index';
	const [page] = hash.split('?');
	
	document.querySelectorAll('.sidebar-item').forEach(item => {
		const isActive = item.dataset.page === page;
		
		if (isActive) {
			item.classList.add('animate-slideInRight');
			setTimeout(() => item.classList.remove('animate-slideInRight'), 300);
		}
		
		item.classList.toggle('bg-blue-50', isActive);
		item.classList.toggle('text-blue-600', isActive);
		item.classList.toggle('font-semibold', isActive);
		item.classList.toggle('shadow-sm', isActive);
	});
}

export function cleanupSidebar() {
	cleanupEventHandlers();
}