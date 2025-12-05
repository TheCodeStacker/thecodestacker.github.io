import { renderSidebar } from './components/sidebar.js';
import { renderCopyright } from './components/copyright.js';
import { renderLanguageModal } from './components/languageModal.js';
import { renderAdminHeader } from './components/adminHeader.js';
import { router } from './utils/router.js';
import { state } from './utils/state.js';
import { errorHandler } from './utils/errorHandler.js';

function waitForLibraries() {
	return new Promise((resolve) => {
		const checkLibraries = () => {
			if (
				typeof marked !== 'undefined' &&
				typeof feather !== 'undefined' &&
				typeof countryFlagEmoji !== 'undefined'
			) {
				resolve();
			} else {
				setTimeout(checkLibraries, 50);
			}
		};
		checkLibraries();
	});
}

async function initApp() {
	try {
		errorHandler.init();

		await waitForLibraries();

		const container = document.querySelector('.container');
		if (!container) {
			throw new Error('Container element not found');
		}

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

		console.log('App initialized successfully');
	} catch (error) {
		errorHandler.handleError(error, {
			type: 'initialization',
			location: 'initApp'
		});
		throw error;
	}
}

initApp().catch(error => {
	console.error('Failed to initialize app:', error);
	
	const container = document.querySelector('.container');
	if (container) {
		container.innerHTML = `
			<div class="flex justify-center items-center min-h-screen bg-gray-50">
				<div class="text-center p-8 max-w-md">
					<div class="text-red-600 text-6xl mb-4">⚠️</div>
					<h1 class="text-2xl font-bold mb-2 text-gray-900">Failed to Load</h1>
					<p class="text-gray-600 mb-4">
						The application failed to initialize. This might be due to:
					</p>
					<ul class="text-left text-sm text-gray-600 mb-6 space-y-2">
						<li>• Network connection issues</li>
						<li>• External resources not loading</li>
						<li>• Browser compatibility issues</li>
					</ul>
					<button 
						onclick="location.reload()" 
						class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg"
					>
						Refresh Page
					</button>
					<p class="text-xs text-gray-500 mt-4">
						If the problem persists, try clearing your browser cache.
					</p>
				</div>
			</div>
		`;
	}
});