import { renderSidebar } from './components/sidebar.js';
import { renderCopyright } from './components/copyright.js';
import { renderLanguageModal } from './components/languageModal.js';
import { renderAdminHeader } from './components/adminHeader.js';
import { router } from './utils/router.js';
import { state } from './utils/state.js';
import { errorHandler } from './utils/errorHandler.js';

async function initApp() {
	try {
		// Initialize error handler first
		errorHandler.init();
		
		console.log('🎨 Initializing app...');

		const container = document.querySelector('.container');
		if (!container) {
			throw new Error('Container element not found');
		}

		// Create app structure
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

		// Initialize state
		state.init();

		// Set initial hash if needed
		if (!window.location.hash) {
			const currentLang = state.getLang();
			const query = currentLang !== 'en' ? `?lang=${currentLang}` : '';
			window.location.hash = `terms-index${query}`;
		}

		// Render all components
		await renderSidebar();
		renderAdminHeader();
		renderCopyright();
		renderLanguageModal();

		// Replace feather icons
		if (typeof feather !== 'undefined' && feather.replace) {
			feather.replace();
		}

		// Initialize router
		router.init();

		console.log('✅ App initialized successfully');
	} catch (error) {
		errorHandler.handleError(error, {
			type: 'initialization',
			location: 'initApp'
		});
		throw error;
	}
}

// Export as default for dynamic import
export default initApp;