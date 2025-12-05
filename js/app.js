import { renderSidebar } from './components/sidebar.js';
import { renderCopyright } from './components/copyright.js';
import { renderLanguageModal } from './components/languageModal.js';
import { renderAdminHeader } from './components/adminHeader.js';
import { router } from './utils/router.js';
import { state } from './utils/state.js';

// Error state management
const errorState = {
	errors: [],
	isDisplaying: false
};

// Global error handler
function setupGlobalErrorHandlers() {
	// Handle uncaught errors
	window.onerror = function(msg, url, lineNo, columnNo, error) {
		console.error('Uncaught Error:', {
			message: msg,
			url: url,
			line: lineNo,
			column: columnNo,
			error: error
		});
		
		showError({
			type: 'Runtime Error',
			message: msg,
			location: `${url}:${lineNo}:${columnNo}`,
			stack: error?.stack
		});
		
		return false;
	};
	
	// Handle unhandled promise rejections
	window.onunhandledrejection = function(event) {
		console.error('Unhandled Promise Rejection:', event.reason);
		
		showError({
			type: 'Promise Rejection',
			message: event.reason?.message || String(event.reason),
			stack: event.reason?.stack
		});
		
		return false;
	};
}

// Display error in UI
function showError(errorInfo) {
	errorState.errors.push({
		...errorInfo,
		timestamp: new Date().toISOString()
	});
	
	if (!errorState.isDisplaying) {
		displayErrorModal();
	} else {
		updateErrorModal();
	}
}

// Create and show error modal
function displayErrorModal() {
	errorState.isDisplaying = true;
	
	const existingModal = document.getElementById('error-modal');
	if (existingModal) existingModal.remove();
	
	const modal = document.createElement('div');
	modal.id = 'error-modal';
	modal.className = 'fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fadeIn';
	
	modal.innerHTML = `
		<div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-scaleIn">
			<!-- Header -->
			<div class="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 rounded-t-2xl flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div class="bg-white/20 p-2 rounded-lg">
						<i data-feather="alert-triangle" class="w-6 h-6 text-white"></i>
					</div>
					<div>
						<h2 class="text-xl font-bold text-white">Error Detected</h2>
						<p class="text-red-100 text-sm">Something went wrong</p>
					</div>
				</div>
				<button id="error-modal-close" class="text-white hover:bg-white/20 p-2 rounded-lg transition">
					<i data-feather="x" class="w-5 h-5"></i>
				</button>
			</div>
			
			<!-- Error Count Badge -->
			<div class="px-6 py-3 bg-red-50 border-b border-red-100">
				<div class="flex items-center justify-between">
					<span class="text-sm text-red-800">
						<strong id="error-count">${errorState.errors.length}</strong> error(s) detected
					</span>
					<button id="clear-errors" class="text-xs text-red-600 hover:text-red-800 font-semibold underline">
						Clear All
					</button>
				</div>
			</div>
			
			<!-- Error List -->
			<div id="error-list" class="flex-1 overflow-y-auto p-6 space-y-4">
				<!-- Errors will be inserted here -->
			</div>
			
			<!-- Footer -->
			<div class="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl flex gap-3">
				<button id="copy-errors" class="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2">
					<i data-feather="copy" class="w-4 h-4"></i>
					Copy Details
				</button>
				<button id="reload-page" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2">
					<i data-feather="refresh-cw" class="w-4 h-4"></i>
					Reload Page
				</button>
			</div>
		</div>
	`;
	
	document.body.appendChild(modal);
	updateErrorModal();
	
	// Event listeners
	document.getElementById('error-modal-close').addEventListener('click', closeErrorModal);
	document.getElementById('clear-errors').addEventListener('click', clearAllErrors);
	document.getElementById('copy-errors').addEventListener('click', copyErrorDetails);
	document.getElementById('reload-page').addEventListener('click', () => location.reload());
	
	// Close on overlay click
	modal.addEventListener('click', (e) => {
		if (e.target === modal) closeErrorModal();
	});
	
	feather?.replace();
}

// Update error list in modal
function updateErrorModal() {
	const errorList = document.getElementById('error-list');
	const errorCount = document.getElementById('error-count');
	
	if (!errorList) return;
	
	if (errorCount) {
		errorCount.textContent = errorState.errors.length;
	}
	
	errorList.innerHTML = errorState.errors.map((err, index) => `
		<div class="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3 animate-slideInRight">
			<!-- Error Header -->
			<div class="flex items-start justify-between gap-3">
				<div class="flex items-start gap-3 flex-1 min-w-0">
					<div class="bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
						${index + 1}
					</div>
					<div class="flex-1 min-w-0">
						<h3 class="font-bold text-red-900 text-sm mb-1">${err.type}</h3>
						<p class="text-red-800 text-sm break-words">${err.message}</p>
					</div>
				</div>
				<button class="error-toggle flex-shrink-0 text-red-600 hover:bg-red-100 p-1.5 rounded transition" data-index="${index}">
					<i data-feather="chevron-down" class="w-4 h-4"></i>
				</button>
			</div>
			
			<!-- Error Details (Collapsed by default) -->
			<div class="error-details hidden space-y-2">
				${err.location ? `
					<div class="bg-white rounded-lg p-3 border border-red-200">
						<div class="text-xs font-semibold text-red-700 mb-1">Location:</div>
						<div class="text-xs text-gray-700 font-mono break-all">${err.location}</div>
					</div>
				` : ''}
				
				${err.stack ? `
					<div class="bg-white rounded-lg p-3 border border-red-200">
						<div class="text-xs font-semibold text-red-700 mb-1">Stack Trace:</div>
						<pre class="text-xs text-gray-700 font-mono overflow-x-auto whitespace-pre-wrap break-all">${err.stack}</pre>
					</div>
				` : ''}
				
				<div class="bg-white rounded-lg p-3 border border-red-200">
					<div class="text-xs font-semibold text-red-700 mb-1">Timestamp:</div>
					<div class="text-xs text-gray-700">${new Date(err.timestamp).toLocaleString()}</div>
				</div>
			</div>
		</div>
	`).join('');
	
	// Add toggle listeners
	document.querySelectorAll('.error-toggle').forEach(btn => {
		btn.addEventListener('click', (e) => {
			const index = parseInt(btn.dataset.index);
			const details = btn.closest('.bg-red-50').querySelector('.error-details');
			const icon = btn.querySelector('i');
			
			if (details.classList.contains('hidden')) {
				details.classList.remove('hidden');
				details.classList.add('animate-fadeIn');
				icon.setAttribute('data-feather', 'chevron-up');
			} else {
				details.classList.add('hidden');
				icon.setAttribute('data-feather', 'chevron-down');
			}
			
			feather?.replace();
		});
	});
	
	feather?.replace();
}

// Close error modal
function closeErrorModal() {
	const modal = document.getElementById('error-modal');
	if (modal) {
		modal.classList.add('opacity-0');
		setTimeout(() => {
			modal.remove();
			errorState.isDisplaying = false;
		}, 300);
	}
}

// Clear all errors
function clearAllErrors() {
	errorState.errors = [];
	closeErrorModal();
}

// Copy error details to clipboard
function copyErrorDetails() {
	const details = errorState.errors.map((err, i) => {
		return `
ERROR ${i + 1}: ${err.type}
Message: ${err.message}
${err.location ? `Location: ${err.location}` : ''}
Timestamp: ${err.timestamp}
${err.stack ? `Stack:\n${err.stack}` : ''}
${'='.repeat(80)}
		`.trim();
	}).join('\n\n');
	
	navigator.clipboard.writeText(details).then(() => {
		const btn = document.getElementById('copy-errors');
		const originalText = btn.innerHTML;
		btn.innerHTML = '<i data-feather="check" class="w-4 h-4"></i> Copied!';
		feather?.replace();
		setTimeout(() => {
			btn.innerHTML = originalText;
			feather?.replace();
		}, 2000);
	});
}

// Main app initialization
async function initApp() {
	try {
		setupGlobalErrorHandlers();
		
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
			window.location.hash = `index${query}`;
		}

		await renderSidebar();
		renderAdminHeader();
		renderCopyright();
		renderLanguageModal();

		feather.replace();

		router.init();
		
	} catch (error) {
		console.error('Critical error in initApp:', error);
		showError({
			type: 'Initialization Error',
			message: error.message,
			stack: error.stack
		});
		
		// Show fallback UI
		document.querySelector('.container').innerHTML = `
			<div class="flex justify-center items-center min-h-screen bg-gradient-to-br from-red-50 to-red-100">
				<div class="text-center p-8 bg-white rounded-2xl shadow-2xl max-w-md">
					<div class="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
						<i data-feather="alert-triangle" class="w-10 h-10 text-red-600"></i>
					</div>
					<h1 class="text-2xl font-bold mb-3 text-gray-900">Failed to Load</h1>
					<p class="text-gray-600 mb-6">The application encountered a critical error and couldn't initialize properly.</p>
					<button onclick="location.reload()" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition shadow-lg hover:shadow-xl">
						<i data-feather="refresh-cw" class="w-4 h-4 inline mr-2"></i>
						Reload Page
					</button>
				</div>
			</div>
		`;
		feather?.replace();
	}
}

// Start the app
initApp();