import { errorHandler } from '../utils/errorHandler.js';

export function renderAdminHeader() {
	try {
		const el = document.getElementById('admin-header');
		if (!el) {
			throw new Error('Admin header element not found');
		}
		
		el.innerHTML = `
			<div class="fixed top-0 left-0 right-0 z-40 bg-white shadow-md lg:left-64">
				<div class="px-4 sm:px-6 lg:px-8">
					<div class="flex items-center justify-between h-20 gap-4">
						<a href="#terms-index" class="flex items-center gap-3 hover:opacity-80 transition min-w-0 flex-1 group">
							<div class="relative flex-shrink-0">
								<div class="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg transition group-hover:scale-105">
									<i data-feather="code" class="w-6 h-6 sm:w-8 sm:h-8 text-white"></i>
								</div>
								<div class="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-white flex items-center justify-center">
									<span class="text-white text-xs font-black">⚡</span>
								</div>
							</div>
							<div class="min-w-0 flex-1">
								<h1 class="text-lg sm:text-xl lg:text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">Code Stacker</h1>
								<p class="text-xs sm:text-sm text-gray-600 font-medium italic truncate">Building the Future, Line by Line.</p>
							</div>
						</a>
					</div>
				</div>
			</div>
		`;
		
		if (typeof feather !== 'undefined' && feather.replace) {
			feather.replace();
		}
	} catch (error) {
		errorHandler.handleError(error, {
			type: 'render_admin_header',
			location: 'adminHeader.renderAdminHeader'
		});
	}
}