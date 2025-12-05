import { state } from '../utils/state.js';
import { openLanguageModal } from './languageModal.js';
import { buildStructure } from '../utils/structureLoader.js';
import { errorHandler } from '../utils/errorHandler.js';

let isOpen = false;
let openGroups = new Set();
let eventHandlers = {
	toggleHandler: null,
	closeHandler: null,
	overlayHandler: null,
	headerHandler: null,
	languageHandler: null,
	hashChangeHandler: null,
	sidebarItemHandlers: [],
	groupToggleHandlers: []
};

function cleanupEventHandlers() {
	try {
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
		
		eventHandlers.groupToggleHandlers.forEach(({ element, handler }) => {
			if (element) element.removeEventListener('click', handler);
		});
		eventHandlers.groupToggleHandlers = [];
	} catch (error) {
		errorHandler.handleError(error, {
			type: 'cleanup_event_handlers',
			location: 'sidebar.cleanupEventHandlers'
		});
	}
}

function toggleGroup(groupId) {
	try {
		if (openGroups.has(groupId)) {
			openGroups.delete(groupId);
		} else {
			openGroups.add(groupId);
		}
		renderSidebarContent();
	} catch (error) {
		errorHandler.handleError(error, {
			type: 'toggle_group',
			location: 'sidebar.toggleGroup',
			groupId
		});
	}
}

function renderGroupItems(groupKey, groupData, lang) {
	try {
		const query = lang !== 'en' ? `?lang=${lang}` : '';
		const isOpen = openGroups.has(groupKey);
		
		let subgroupsHtml = '';
		
		if (groupData.children) {
			for (const [subKey, subData] of Object.entries(groupData.children)) {
				if (subData.children) {
					const subgroupId = `${groupKey}-${subKey}`;
					const isSubOpen = openGroups.has(subgroupId);
					
					let itemsHtml = '';
					for (const [itemKey, itemData] of Object.entries(subData.children)) {
						itemsHtml += `
							<a href="#${itemKey}${query}" 
							   class="sidebar-item flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg ml-6 transition" 
							   data-page="${itemKey}">
								<div class="bg-blue-100 p-1 rounded">
									<i data-feather="${itemData.icon}" class="w-3.5 h-3.5 text-blue-600"></i>
								</div>
								<span class="text-sm">${itemData.title}</span>
							</a>
						`;
					}
					
					subgroupsHtml += `
						<div class="ml-2 mt-2">
							<button class="group-toggle w-full flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-indigo-50 rounded-lg transition text-left" 
							        data-group="${subgroupId}">
								<i data-feather="${isSubOpen ? 'chevron-down' : 'chevron-right'}" class="w-4 h-4 text-indigo-600"></i>
								<div class="bg-indigo-100 p-1 rounded">
									<i data-feather="${subData.icon}" class="w-3.5 h-3.5 text-indigo-600"></i>
								</div>
								<span class="text-sm font-semibold">${subData.title}</span>
							</button>
							<div class="subgroup-items ${isSubOpen ? '' : 'hidden'} ml-1 space-y-1 mt-1.5">
								${itemsHtml}
							</div>
						</div>
					`;
				} else if (subData.path) {
					subgroupsHtml += `
						<a href="#${subKey}${query}" 
						   class="sidebar-item flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg ml-2 mt-1 transition" 
						   data-page="${subKey}">
							<div class="bg-blue-100 p-1 rounded">
								<i data-feather="${subData.icon}" class="w-3.5 h-3.5 text-blue-600"></i>
							</div>
							<span class="text-sm">${subData.title}</span>
						</a>
					`;
				}
			}
		}
		
		return `
			<div class="mb-3 px-1">
				<button class="group-toggle w-full flex items-center gap-2.5 px-4 py-2.5 text-gray-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition font-bold text-left border border-blue-200" 
				        data-group="${groupKey}">
					<i data-feather="${isOpen ? 'chevron-down' : 'chevron-right'}" class="w-5 h-5 text-blue-600"></i>
					<div class="bg-blue-600 p-1.5 rounded-lg">
						<i data-feather="${groupData.icon}" class="w-5 h-5 text-white"></i>
					</div>
					<span>${groupData.title}</span>
				</button>
				<div class="group-items ${isOpen ? '' : 'hidden'} space-y-1.5 mt-2 pl-2">
					${subgroupsHtml}
				</div>
			</div>
		`;
	} catch (error) {
		errorHandler.handleError(error, {
			type: 'render_group_items',
			location: 'sidebar.renderGroupItems',
			groupKey,
			lang
		});
		return '';
	}
}

async function renderSidebarContent() {
	try {
		const nav = document.querySelector('#sidebar-content nav');
		if (!nav) throw new Error('Sidebar nav element not found');
		
		const lang = state.getLang();
		const registry = await buildStructure(lang);
		
		let html = '';
		for (const [key, data] of Object.entries(registry)) {
			if (data.type === 'group') {
				html += renderGroupItems(key, data, lang);
			}
		}
		
		nav.innerHTML = html;
		
		document.querySelectorAll('.group-toggle').forEach(btn => {
			const groupId = btn.dataset.group;
			const handler = (e) => {
				e.preventDefault();
				e.stopPropagation();
				toggleGroup(groupId);
			};
			eventHandlers.groupToggleHandlers.push({ element: btn, handler });
			btn.addEventListener('click', handler);
		});
		
		document.querySelectorAll('.sidebar-item').forEach(item => {
			const handler = () => {
				if (window.innerWidth < 1024) {
					setTimeout(() => toggleSidebar(false), 150);
				}
			};
			eventHandlers.sidebarItemHandlers.push({ element: item, handler });
			item.addEventListener('click', handler);
		});
		
		updateActiveItem();
		feather.replace();
	} catch (error) {
		errorHandler.handleError(error, {
			type: 'render_sidebar_content',
			location: 'sidebar.renderSidebarContent'
		});
	}
}

export async function renderSidebar() {
	try {
		const el = document.getElementById('sidebar');
		if (!el) throw new Error('Sidebar element not found');
		
		const render = async () => {
			try {
				cleanupEventHandlers();
				
				el.innerHTML = `
					<button id="sidebar-toggle" class="fixed top-4 right-4 z-50 lg:hidden bg-blue-600 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition">
						<i data-feather="menu" class="w-6 h-6"></i>
					</button>
					<div id="sidebar-overlay" class="fixed inset-0 bg-black/50 z-30 lg:hidden hidden transition-opacity"></div>
					<div id="sidebar-content" class="fixed lg:sticky top-0 left-0 z-40 w-64 bg-white border-r border-gray-200 h-screen flex flex-col transform -translate-x-full lg:translate-x-0 transition-transform shadow-xl">
						<div class="p-4 border-b border-gray-200 bg-blue-50 flex items-center justify-between gap-2">
							<button id="sidebar-header" class="flex items-center gap-3 hover:opacity-80 lg:cursor-default lg:hover:opacity-100 transition flex-1 min-w-0">
								<i data-feather="layers" class="w-8 h-8 text-blue-600 flex-shrink-0"></i>
								<h2 class="text-xl font-bold text-blue-600 truncate">Code Stacker</h2>
							</button>
							<button id="sidebar-close" class="lg:hidden text-gray-500 hover:text-red-500 flex-shrink-0 transition">
								<i data-feather="x" class="w-6 h-6"></i>
							</button>
						</div>
						<div class="px-4 pt-8 pb-4 border-b border-gray-200">
							<button id="language-button" class="w-full flex items-center gap-2 justify-center py-2.5 px-3 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition">
								<i data-feather="globe" class="w-4 h-4"></i>
								<span>Language</span>
							</button>
						</div>
						<nav class="flex-1 overflow-y-auto py-3 px-2"></nav>
					</div>
				`;
				
				const toggle = document.getElementById('sidebar-toggle');
				const close = document.getElementById('sidebar-close');
				const overlay = document.getElementById('sidebar-overlay');
				const header = document.getElementById('sidebar-header');
				
				if (!toggle || !close || !overlay || !header) {
					throw new Error('Sidebar control elements not found');
				}
				
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
				
				eventHandlers.languageHandler = (e) => {
					try {
						if (e.target.closest('#language-button')) {
							openLanguageModal();
						}
					} catch (error) {
						errorHandler.handleError(error, {
							type: 'language_button_click',
							location: 'sidebar.languageHandler'
						});
					}
				};
				el.addEventListener('click', eventHandlers.languageHandler);
				
				await renderSidebarContent();
				feather.replace();
			} catch (error) {
				errorHandler.handleError(error, {
					type: 'render_sidebar_inner',
					location: 'sidebar.render'
				});
			}
		};
		
		await render();
		
		eventHandlers.hashChangeHandler = () => {
			try {
				updateActiveItem();
			} catch (error) {
				errorHandler.handleError(error, {
					type: 'hash_change',
					location: 'sidebar.hashChangeHandler'
				});
			}
		};
		window.addEventListener('hashchange', eventHandlers.hashChangeHandler);
		
		state.subscribe(async () => {
			try {
				await render();
			} catch (error) {
				errorHandler.handleError(error, {
					type: 'state_subscribe',
					location: 'sidebar.stateSubscribe'
				});
			}
		});
	} catch (error) {
		errorHandler.handleError(error, {
			type: 'render_sidebar',
			location: 'sidebar.renderSidebar'
		});
	}
}

function toggleSidebar(open) {
	try {
		isOpen = open;
		const content = document.getElementById('sidebar-content');
		const overlay = document.getElementById('sidebar-overlay');
		
		if (!content || !overlay) {
			throw new Error('Sidebar content or overlay not found');
		}
		
		if (open) {
			content.classList.remove('-translate-x-full');
			overlay.classList.remove('hidden');
			setTimeout(() => overlay.classList.add('opacity-100'), 10);
		} else {
			content.classList.add('-translate-x-full');
			overlay.classList.remove('opacity-100');
			setTimeout(() => overlay.classList.add('hidden'), 300);
		}
	} catch (error) {
		errorHandler.handleError(error, {
			type: 'toggle_sidebar',
			location: 'sidebar.toggleSidebar',
			open
		});
	}
}

function updateActiveItem() {
	try {
		const hash = window.location.hash.slice(1) || 'terms-index';
		const [page] = hash.split('?');
		
		document.querySelectorAll('.sidebar-item').forEach(item => {
			const isActive = item.dataset.page === page;
			
			item.classList.toggle('bg-blue-600', isActive);
			item.classList.toggle('text-white', isActive);
			item.classList.toggle('font-semibold', isActive);
		});
	} catch (error) {
		errorHandler.handleError(error, {
			type: 'update_active_item',
			location: 'sidebar.updateActiveItem',
			hash: window.location.hash
		});
	}
}

export function cleanupSidebar() {
	cleanupEventHandlers();
}