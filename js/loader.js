// loader.js - Handles loading of all external dependencies

const EXTERNAL_SCRIPTS = [
	{
		name: 'Tailwind CSS',
		url: 'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4.1.17/dist/index.global.min.js',
		test: () => typeof window.tailwind !== 'undefined'
	},
	{
		name: 'Marked',
		url: 'https://cdn.jsdelivr.net/npm/marked@17.0.1/lib/marked.umd.min.js',
		test: () => typeof marked !== 'undefined'
	},
	{
		name: 'Feather Icons',
		url: 'https://cdn.jsdelivr.net/npm/feather-icons@4.29.2/dist/feather.min.js',
		test: () => typeof feather !== 'undefined'
	},
	{
		name: 'Country Flag Emoji',
		url: 'https://cdn.jsdelivr.net/npm/country-flag-emoji@1.0.3/dist/country-flag-emoji.umd.min.js',
		test: () => typeof countryFlagEmoji !== 'undefined'
	}
];

class ScriptLoader {
	constructor() {
		this.loaded = new Set();
		this.failed = new Set();
	}

	async loadScript(script) {
		return new Promise((resolve, reject) => {
			// Check if already loaded
			if (script.test()) {
				this.loaded.add(script.name);
				resolve();
				return;
			}

			const scriptEl = document.createElement('script');
			scriptEl.src = script.url;
			scriptEl.crossOrigin = 'anonymous';
			
			const timeout = setTimeout(() => {
				this.failed.add(script.name);
				reject(new Error(`Timeout loading ${script.name}`));
			}, 15000); // 15 second timeout

			scriptEl.onload = () => {
				clearTimeout(timeout);
				
				// Verify script actually loaded
				setTimeout(() => {
					if (script.test()) {
						this.loaded.add(script.name);
						console.log(`✅ Loaded: ${script.name}`);
						resolve();
					} else {
						this.failed.add(script.name);
						reject(new Error(`${script.name} loaded but not available`));
					}
				}, 100);
			};

			scriptEl.onerror = () => {
				clearTimeout(timeout);
				this.failed.add(script.name);
				reject(new Error(`Failed to load ${script.name} from ${script.url}`));
			};

			document.head.appendChild(scriptEl);
		});
	}

	async loadAll() {
		const results = await Promise.allSettled(
			EXTERNAL_SCRIPTS.map(script => this.loadScript(script))
		);

		const errors = results
			.filter(r => r.status === 'rejected')
			.map(r => r.reason.message);

		if (errors.length > 0) {
			throw new Error(`Failed to load dependencies:\n${errors.join('\n')}`);
		}

		return true;
	}

	showError(error) {
		const container = document.querySelector('.container');
		if (!container) return;

		const failedScripts = Array.from(this.failed);
		const loadedScripts = Array.from(this.loaded);

		container.innerHTML = `
			<div class="flex justify-center items-center min-h-screen bg-gray-50">
				<div class="text-center p-8 max-w-2xl">
					<div class="text-red-600 text-6xl mb-4">⚠️</div>
					<h1 class="text-2xl font-bold mb-2 text-gray-900">Failed to Load Dependencies</h1>
					<p class="text-gray-600 mb-4">
						Some required libraries could not be loaded. This might be due to:
					</p>
					<ul class="text-left text-sm text-gray-600 mb-6 space-y-2 bg-gray-100 p-4 rounded-lg">
						<li>• Network connection issues</li>
						<li>• CDN service unavailable</li>
						<li>• Browser blocking external scripts</li>
						<li>• Ad blockers or privacy extensions</li>
					</ul>
					
					${failedScripts.length > 0 ? `
						<div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
							<h3 class="font-bold text-red-900 mb-2">Failed to Load:</h3>
							<ul class="text-left text-sm text-red-700 space-y-1">
								${failedScripts.map(name => `<li>❌ ${name}</li>`).join('')}
							</ul>
						</div>
					` : ''}
					
					${loadedScripts.length > 0 ? `
						<div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
							<h3 class="font-bold text-green-900 mb-2">Successfully Loaded:</h3>
							<ul class="text-left text-sm text-green-700 space-y-1">
								${loadedScripts.map(name => `<li>✅ ${name}</li>`).join('')}
							</ul>
						</div>
					` : ''}
					
					<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
						<p class="text-sm text-yellow-800">
							<strong>Error Details:</strong><br>
							${error.message.replace(/\n/g, '<br>')}
						</p>
					</div>
					
					<div class="flex gap-3 justify-center">
						<button 
							onclick="location.reload()" 
							class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg"
						>
							🔄 Retry
						</button>
						<button 
							onclick="window.location.href='https://thecodestacker.github.io'" 
							class="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold shadow-lg"
						>
							🏠 Home
						</button>
					</div>
					
					<p class="text-xs text-gray-500 mt-6">
						If the problem persists, try:<br>
						1. Check your internet connection<br>
						2. Disable ad blockers temporarily<br>
						3. Try a different browser<br>
						4. Clear your browser cache
					</p>
				</div>
			</div>
		`;
	}

	showLoading() {
		const container = document.querySelector('.container');
		if (!container) return;

		container.innerHTML = `
			<div class="flex justify-center items-center min-h-screen bg-gray-50">
				<div class="text-center">
					<div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
					<h2 class="text-xl font-bold text-gray-900 mb-2">Loading Code Stacker</h2>
					<p class="text-gray-600 animate-pulse">Loading dependencies...</p>
					<div class="mt-4 text-sm text-gray-500">
						${Array.from(this.loaded).map(name => `✅ ${name}`).join('<br>')}
					</div>
				</div>
			</div>
		`;
	}
}

async function init() {
	const loader = new ScriptLoader();
	
	try {
		loader.showLoading();
		
		console.log('🚀 Starting dependency loading...');
		await loader.loadAll();
		console.log('✅ All dependencies loaded successfully');
		
		// Import and initialize the main app
		const { default: initApp } = await import('./app.js');
		await initApp();
		
	} catch (error) {
		console.error('❌ Initialization failed:', error);
		loader.showError(error);
	}
}

// Start the initialization
init();