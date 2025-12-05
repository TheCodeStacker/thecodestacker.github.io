import { errorHandler } from '../utils/errorHandler.js';

export function renderCopyright() {
	try {
		const copyrightEl = document.getElementById('copyright');
		if (!copyrightEl) {
			throw new Error('Copyright element not found');
		}

		const currentYear = new Date().getFullYear();

		copyrightEl.innerHTML = `
			<div class="mt-8 text-center text-sm text-gray-500">
				<p>© ${currentYear} CodeStacker. All rights reserved.</p>
			</div>
		`;
	} catch (error) {
		errorHandler.handleError(error, {
			type: 'render_copyright',
			location: 'copyright.renderCopyright'
		});
	}
}