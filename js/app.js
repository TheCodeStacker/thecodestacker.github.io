import { renderSidebar } from './components/sidebar.js';
import { renderCopyright } from './components/copyright.js';
import { renderLanguageModal } from './components/languageModal.js';
import { renderAdminHeader } from './components/adminHeader.js';
import { router } from './utils/router.js';
import { state } from './utils/state.js';

export async function initApp() {
	const container = document.querySelector('.container');
	if (!container) return;

	container.innerHTML = `
		<div class="flex min-h-screen">
			<div id="sidebar"></div>
			<div class="flex-1">
				<div id="admin-header"></div>
				<div class="max-w-4xl mx-auto px-2 py-6 pt-24">
					<div class="bg-white rounded-lg shadow-sm overflow-hidden">
						<div id="header"></div>
						<div id="content"></div>
					</div>
					<div id="copyright"></div>
				</div>
			</div>
		</div>
	`;

	state.init();

	if (!window.location.hash) {
		const currentLang = state.getLang();
		const query = currentLang !== 'en' ? `?lang=${currentLang}` : '';
		window.location.hash = `terms-index${query}`;
	}

	await renderSidebar();
	renderAdminHeader();
	renderCopyright();
	renderLanguageModal();

	if (typeof feather !== 'undefined' && feather.replace) {
		feather.replace();
	}

	router.init();
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initApp);
} else {
	initApp();
}