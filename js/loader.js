// loader.js - Direct import from CDN
console.log('🔧 Loader starting...');

function showLoading(message = 'Loading...') {
	const container = document.querySelector('.container');
	if (!container) return;
	
	container.innerHTML = `
		<div class="flex justify-center items-center min-h-screen bg-gray-50">
			<div class="text-center">
				<div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
				<h2 class="text-xl font-bold text-gray-900 mb-2">Code Stacker</h2>
				<p class="text-gray-600">${message}</p>
			</div>
		</div>
	`;
}

function showError(error) {
	const container = document.querySelector('.container');
	if (!container) return;
	
	container.innerHTML = `
		<div class="flex justify-center items-center min-h-screen bg-gray-50 p-4">
			<div class="text-center max-w-md bg-white rounded-lg shadow-lg p-8">
				<div class="text-red-600 text-6xl mb-4">⚠️</div>
				<h1 class="text-2xl font-bold mb-2 text-gray-900">Failed to Load</h1>
				<p class="text-gray-600 mb-4">${error.message}</p>
				<button 
					onclick="location.reload()" 
					class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
				>
					🔄 Retry
				</button>
				<details class="mt-4 text-left">
					<summary class="cursor-pointer text-sm text-gray-600">Details</summary>
					<pre class="text-xs mt-2 p-2 bg-gray-100 rounded overflow-auto">${error.stack || error.message}</pre>
				</details>
			</div>
		</div>
	`;
}

async function init() {
	try {
		showLoading('Loading dependencies...');
		console.log('📦 Loading dependencies...');
		
		// Import marked from CDN
		const markedModule = await import('https://cdn.jsdelivr.net/npm/marked@11.1.1/+esm');
		window.marked = markedModule.marked || markedModule.default;
		console.log('✅ Marked loaded', typeof window.marked);
		
		// Import feather-icons from CDN
		const featherModule = await import('https://cdn.jsdelivr.net/npm/feather-icons@4.29.2/+esm');
		window.feather = featherModule.default || featherModule;
		console.log('✅ Feather loaded', typeof window.feather);
		
		// Load country flag emoji (UMD, doesn't support ES modules)
		await new Promise((resolve, reject) => {
			const script = document.createElement('script');
			script.src = 'https://cdn.jsdelivr.net/npm/country-flag-emoji@1.0.3/dist/country-flag-emoji.umd.min.js';
			script.onload = () => {
				console.log('✅ Country Flag Emoji loaded');
				resolve();
			};
			script.onerror = () => {
				console.warn('⚠️ Country Flag Emoji failed, using fallback');
				window.countryFlagEmoji = { get: (code) => ({ emoji: code }) };
				resolve(); // Continue anyway with fallback
			};
			document.head.appendChild(script);
			
			// Timeout after 5s
			setTimeout(() => {
				if (typeof countryFlagEmoji === 'undefined') {
					console.warn('⚠️ Country Flag Emoji timeout, using fallback');
					window.countryFlagEmoji = { get: (code) => ({ emoji: code }) };
					resolve();
				}
			}, 5000);
		});
		
		console.log('✅ All dependencies loaded');
		
		// Load main app
		showLoading('Initializing app...');
		console.log('📱 Loading app...');
		
		// Try to import app.js with explicit path
		const appModule = await import('./app.js').catch(async (err) => {
			console.warn('Failed to load ./app.js, trying absolute path:', err);
			// Fallback to absolute path
			const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '');
			return await import(`${baseUrl}/js/app.js`);
		});
		
		console.log('App module loaded:', appModule);
		
		if (!appModule.initApp || typeof appModule.initApp !== 'function') {
			throw new Error('initApp function not found in app module');
		}
		
		await appModule.initApp();
		
		console.log('🎉 App ready!');
		
	} catch (error) {
		console.error('❌ Initialization failed:', error);
		showError(error);
	}
}

init();