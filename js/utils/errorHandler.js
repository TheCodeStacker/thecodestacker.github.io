import { showErrorModal } from '../components/errorModal.js';

class ErrorHandler {
	constructor() {
		this.initialized = false;
		this.errorLog = [];
	}

	init() {
		if (this.initialized) return;

		window.addEventListener('error', (event) => {
			this.handleError(event.error || new Error(event.message), {
				type: 'uncaught',
				filename: event.filename,
				lineno: event.lineno,
				colno: event.colno
			});
		});

		window.addEventListener('unhandledrejection', (event) => {
			this.handleError(
				event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
				{ type: 'unhandled_promise' }
			);
		});

		this.initialized = true;
	}

	handleError(error, context = {}) {
		const errorInfo = {
			error,
			context,
			timestamp: new Date().toISOString()
		};

		this.errorLog.push(errorInfo);

		console.error('Error caught by handler:', error, context);

		showErrorModal(error);
	}

	wrapAsync(fn) {
		return async (...args) => {
			try {
				return await fn(...args);
			} catch (error) {
				this.handleError(error, { type: 'async_wrapped' });
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
}

export const errorHandler = new ErrorHandler();