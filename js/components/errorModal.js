let errorModalInstance = null;
let eventHandlers = {
	closeHandler: null,
	copyHandler: null,
	reloadHandler: null,
	overlayHandler: null
};

function cleanupErrorModalEvents() {
	const modal = document.getElementById('error-modal');
	const closeBtn = document.getElementById('error-close');
	const copyBtn = document.getElementById('error-copy');
	const reloadBtn = document.getElementById('error-reload');
	
	if (modal && eventHandlers.overlayHandler) {
		modal.removeEventListener('click', eventHandlers.overlayHandler);
	}
	if (closeBtn && eventHandlers.closeHandler) {
		closeBtn.removeEventListener('click', eventHandlers.closeHandler);
	}
	if (copyBtn && eventHandlers.copyHandler) {
		copyBtn.removeEventListener('click', eventHandlers.copyHandler);
	}
	if (reloadBtn && eventHandlers.reloadHandler) {
		reloadBtn.removeEventListener('click', eventHandlers.reloadHandler);
	}
	
	eventHandlers = {
		closeHandler: null,
		copyHandler: null,
		reloadHandler: null,
		overlayHandler: null
	};
}

export function showErrorModal(error) {
	if (errorModalInstance) {
		cleanupErrorModalEvents();
		errorModalInstance.remove();
	}

	const errorDetails = {
		message: error.message || 'Unknown error occurred',
		name: error.name || 'Error',
		stack: error.stack || 'No stack trace available',
		timestamp: new Date().toISOString(),
		url: window.location.href,
		userAgent: navigator.userAgent
	};

	const errorJson = JSON.stringify(errorDetails, null, 2);

	const modal = document.createElement('div');
	modal.id = 'error-modal';
	modal.className = 'fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn';
	
	modal.innerHTML = `
		<div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-scaleIn">
			<div class="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-red-100">
				<div class="flex items-center gap-4">
					<div class="bg-red-500 p-3 rounded-full">
						<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
						</svg>
					</div>
					<div class="flex-1">
						<h2 class="text-2xl font-black text-gray-900">Application Error</h2>
						<p class="text-sm text-gray-600 mt-1">Something went wrong. Please see details below.</p>
					</div>
					<button id="error-close" class="text-gray-400 hover:text-gray-600 transition">
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
			</div>
			
			<div class="flex-1 overflow-y-auto p-6 space-y-4">
				<div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
					<div class="flex items-start gap-3">
						<svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
						</svg>
						<div class="flex-1">
							<p class="font-bold text-red-900 mb-1">${errorDetails.name}</p>
							<p class="text-red-800 text-sm break-words">${errorDetails.message}</p>
						</div>
					</div>
				</div>

				<div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
					<h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
						<svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						Error Details
					</h3>
					<dl class="space-y-2 text-sm">
						<div class="flex gap-2">
							<dt class="font-semibold text-gray-700 min-w-[100px]">Type:</dt>
							<dd class="text-gray-600 break-all">${errorDetails.name}</dd>
						</div>
						<div class="flex gap-2">
							<dt class="font-semibold text-gray-700 min-w-[100px]">Time:</dt>
							<dd class="text-gray-600">${new Date(errorDetails.timestamp).toLocaleString()}</dd>
						</div>
						<div class="flex gap-2">
							<dt class="font-semibold text-gray-700 min-w-[100px]">Location:</dt>
							<dd class="text-gray-600 break-all">${errorDetails.url}</dd>
						</div>
					</dl>
				</div>

				<div class="bg-gray-900 rounded-lg overflow-hidden">
					<div class="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
						<span class="text-gray-300 text-sm font-semibold">Stack Trace</span>
						<button id="error-copy" class="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded transition">
							Copy
						</button>
					</div>
					<pre class="p-4 text-xs text-gray-100 overflow-x-auto max-h-64"><code>${errorDetails.stack}</code></pre>
				</div>

				<details class="bg-blue-50 border border-blue-200 rounded-lg overflow-hidden">
					<summary class="cursor-pointer px-4 py-3 font-semibold text-blue-900 hover:bg-blue-100 transition">
						Full Error Report (JSON)
					</summary>
					<pre class="p-4 text-xs text-gray-800 overflow-x-auto bg-white border-t border-blue-200"><code>${errorJson}</code></pre>
				</details>

				<div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
					<div class="flex items-start gap-3">
						<svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
						</svg>
						<div>
							<p class="font-semibold text-yellow-900 mb-1">What to do next?</p>
							<ul class="text-sm text-yellow-800 space-y-1 list-disc list-inside">
								<li>Try reloading the page</li>
								<li>Clear your browser cache and cookies</li>
								<li>If the problem persists, please copy the error details and report it</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			
			<div class="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
				<button id="error-reload" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
					</svg>
					Reload Page
				</button>
				<button id="error-close-alt" class="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-lg font-semibold transition">
					Close
				</button>
			</div>
		</div>
	`;

	document.body.appendChild(modal);
	errorModalInstance = modal;

	const closeModal = () => {
		modal.classList.add('opacity-0');
		setTimeout(() => {
			cleanupErrorModalEvents();
			modal.remove();
			errorModalInstance = null;
		}, 200);
	};

	eventHandlers.closeHandler = closeModal;
	eventHandlers.overlayHandler = (e) => {
		if (e.target === modal) closeModal();
	};
	eventHandlers.copyHandler = () => {
		navigator.clipboard.writeText(errorJson);
		const btn = document.getElementById('error-copy');
		if (btn) {
			const originalText = btn.textContent;
			btn.textContent = 'Copied!';
			btn.classList.add('bg-green-600');
			setTimeout(() => {
				btn.textContent = originalText;
				btn.classList.remove('bg-green-600');
			}, 2000);
		}
	};
	eventHandlers.reloadHandler = () => {
		window.location.reload();
	};

	modal.addEventListener('click', eventHandlers.overlayHandler);
	document.getElementById('error-close')?.addEventListener('click', eventHandlers.closeHandler);
	document.getElementById('error-close-alt')?.addEventListener('click', eventHandlers.closeHandler);
	document.getElementById('error-copy')?.addEventListener('click', eventHandlers.copyHandler);
	document.getElementById('error-reload')?.addEventListener('click', eventHandlers.reloadHandler);
}

export function cleanupErrorModal() {
	if (errorModalInstance) {
		cleanupErrorModalEvents();
		errorModalInstance.remove();
		errorModalInstance = null;
	}
}