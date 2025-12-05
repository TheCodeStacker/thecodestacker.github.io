import { renderSidebar } from './components/sidebar.js';
import { renderCopyright } from './components/copyright.js';
import { renderLanguageModal } from './components/languageModal.js';
import { renderAdminHeader } from './components/adminHeader.js';
import { router } from './utils/router.js';
import { state } from './utils/state.js';

async function initApp() {
	const container = document.querySelector('.container');

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
		window.location.hash = `index${query}`;
	}

	await renderSidebar();
	renderAdminHeader();
	renderCopyright();
	renderLanguageModal();

	feather.replace();

	router.init();
}

initApp().catch(error => {
	console.error('Failed to initialize app:', error);
	document.querySelector('.container').innerHTML = `
		<div class="flex justify-center items-center min-h-screen">
			<div class="text-center p-8">
				<div class="text-red-600 text-6xl mb-4">⚠️</div>
				<h1 class="text-2xl font-bold mb-2">Failed to Load</h1>
				<p class="text-gray-600 mb-4">Something went wrong. Please refresh the page.</p>
				<button onclick="location.reload()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
					Refresh Page
				</button>
			</div>
		</div>
	`;
});