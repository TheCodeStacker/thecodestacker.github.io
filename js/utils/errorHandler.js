import { showErrorModal } from '../components/errorModal.js';

class ErrorHandler {
	constructor() {
		this.initialized = false;
		this.errorLog = [];
		this.maxLogSize = 100;
	}

	init() {
		if (this.initialized) return;

		window.addEventListener('error', (event) => {
			event.preventDefault();
			
			if (event.message === 'Script error.' && !event.filename) {
				this.handleError(new Error('External script loading error (likely CORS)'), {
					type: 'cross_origin_script',
					message: 'A script from an external source failed to load or execute'
				});
				return;
			}

			this.handleError(event.error || new Error(event.message), {
				type: 'uncaught',
				filename: event.filename,
				lineno: event.lineno,
				colno: event.colno
			});
		});

		window.addEventListener('unhandledrejection', (event) => {
			event.preventDefault();
			
			this.handleError(
				event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
				{ type: 'unhandled_promise' }
			);
		});

		this.checkRequiredLibraries();

		this.initialized = true;
	}

	checkRequiredLibraries() {
		const requiredLibs = [
			{ name: 'marked', check: () => typeof marked !== 'undefined' },
			{ name: 'feather', check: () => typeof feather !== 'undefined' },
			{ name: 'countryFlagEmoji', check: () => typeof countryFlagEmoji !== 'undefined' }
		];

		setTimeout(() => {
			const missing = requiredLibs.filter(lib => !lib.check());
			
			if (missing.length > 0) {
				console.warn('Missing libraries:', missing.map(l => l.name));
				this.handleError(new Error(`Required libraries not loaded: ${missing.map(l => l.name).join(', ')}`), {
					type: 'missing_dependencies',
					libraries: missing.map(l => l.name)
				});
			}
		}, 2000);
	}

	handleError(error, context = {}) {
		const errorInfo = {
			error,
			context,
			timestamp: new Date().toISOString(),
			userAgent: navigator.userAgent,
			url: window.location.href,
			screenSize: `${window.innerWidth}x${window.innerHeight}`,
			online: navigator.onLine
		};

		this.errorLog.push(errorInfo);
		if (this.errorLog.length > this.maxLogSize) {
			this.errorLog.shift();
		}

		console.group('%c🔴 Error Handler', 'color: #ef4444; font-weight: bold; font-size: 14px');
		console.error('Error:', error);
		console.table(context);
		console.groupEnd();

		if (this.shouldShowModal(error, context)) {
			try {
				showErrorModal(error);
			} catch (modalError) {
				console.error('Failed to show error modal:', modalError);
				alert(`An error occurred: ${error.message}\n\nPlease refresh the page.`);
			}
		}
	}

	shouldShowModal(error, context) {
		const silentTypes = ['fetch_abort', 'navigation_cancelled'];
		
		if (silentTypes.includes(context.type)) {
			return false;
		}

		if (!navigator.onLine && context.type === 'fetch_markdown') {
			return false;
		}

		return true;
	}

	wrapAsync(fn, contextInfo = {}) {
		return async (...args) => {
			try {
				return await fn(...args);
			} catch (error) {
				this.handleError(error, { 
					type: 'async_wrapped',
					...contextInfo
				});
				throw error;
			}
		};
	}

	wrap(fn, contextInfo = {}) {
		return (...args) => {
			try {
				return fn(...args);
			} catch (error) {
				this.handleError(error, {
					type: 'sync_wrapped',
					...contextInfo
				});
				throw error;
			}
		};
	}

	getErrorLog() {
		return this.errorLog;
	}

	clearErrorLog() {
		this.errorLog = [];
	}

	exportErrorLog() {
		const data = JSON.stringify(this.errorLog, null, 2);
		const blob = new Blob([data], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `error-log-${Date.now()}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}
}

export const errorHandler = new ErrorHandler();