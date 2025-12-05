export function renderHeader(data) {
	document.getElementById('header').innerHTML = `
		<div class="bg-gradient-to-r from-blue-600 to-blue-800 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-white relative overflow-hidden">
			<div class="absolute inset-0 opacity-10 bg-gradient-to-br from-white to-transparent"></div>
			<div class="relative z-10">
				<div class="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
					<div class="bg-white/20 p-2 sm:p-3 rounded-xl shadow-lg flex-shrink-0 transition hover:bg-white/30 hover:scale-105">
						<i data-feather="${data.icon}" class="w-8 h-8 sm:w-10 sm:h-10 stroke-current"></i>
					</div>
					<h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight break-words">${data.title}</h1>
				</div>
				<p class="text-blue-100 text-base sm:text-lg font-medium ml-1">Please read this information carefully</p>
			</div>
		</div>
	`;
}