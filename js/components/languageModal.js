import { state } from '../utils/state.js';
import { languageConfig } from '../config/languages.js';

const bgColors = [
	'linear-gradient(135deg, #eff6ff, #dbeafe)',
	'linear-gradient(135deg, #fef2f2, #fee2e2)',
	'linear-gradient(135deg, #f0fdf4, #dcfce7)',
	'linear-gradient(135deg, #fef3c7, #fde68a)',
	'linear-gradient(135deg, #fae8ff, #f3e8ff)'
];

const getFlag = code => countryFlagEmoji?.get(code)?.emoji || code;

let eventHandlers = {
	modalClickHandler: null,
	closeClickHandler: null,
	langClickHandlers: {}
};

function cleanupModalEvents() {
	const modal = document.getElementById('language-modal');
	const closeBtn = document.getElementById('modal-close-lang');
	
	if (modal && eventHandlers.modalClickHandler) {
		modal.removeEventListener('click', eventHandlers.modalClickHandler);
	}
	
	if (closeBtn && eventHandlers.closeClickHandler) {
		closeBtn.removeEventListener('click', eventHandlers.closeClickHandler);
	}
	
	Object.keys(eventHandlers.langClickHandlers).forEach(code => {
		const btn = document.getElementById(`modal-lang-${code}`);
		if (btn && eventHandlers.langClickHandlers[code]) {
			btn.removeEventListener('click', eventHandlers.langClickHandlers[code]);
		}
	});
	
	eventHandlers.langClickHandlers = {};
}

export function renderLanguageModal() {
	const existing = document.getElementById('language-modal');
	if (existing) {
		cleanupModalEvents();
		existing.remove();
	}

	let buttons = '';
	let idx = 0;
	
	for (const [code, lang] of Object.entries(languageConfig)) {
		const flag = getFlag(lang.countryCode);
		const bg = bgColors[idx++ % bgColors.length];
		
		buttons += `
			<button id="modal-lang-${code}" class="w-full p-4 rounded-2xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 hover:shadow-lg hover:scale-105" data-lang="${code}">
				<div class="flex items-center gap-4">
					<div class="w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm transition-transform duration-200" style="background:${bg}">
						<span style="font-size:2.5rem">${flag}</span>
					</div>
					<div class="flex-1 text-left">
						<div class="font-bold text-lg text-gray-900">${lang.name}</div>
						<div class="text-sm text-gray-500">${lang.nativeName}</div>
					</div>
					<div class="language-check opacity-0 transition-opacity duration-200">
						<i data-feather="check-circle" class="w-7 h-7 text-blue-500"></i>
					</div>
				</div>
			</button>
		`;
	}

	document.body.insertAdjacentHTML('beforeend', `
		<div id="language-modal" class="hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
			<div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0" id="modal-content">
				<div class="p-8 text-center border-b border-gray-100">
					<h2 class="text-3xl font-black text-gray-900 mb-2 animate-slideInLeft">Choose Language</h2>
					<p class="text-gray-500 animate-fadeIn">Select your preferred language</p>
				</div>
				<div class="p-6">
					<div class="space-y-3">${buttons}</div>
				</div>
				<div class="p-6 border-t border-gray-100">
					<button id="modal-close-lang" class="w-full py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl font-semibold transition-all duration-200">Cancel</button>
				</div>
			</div>
		</div>
	`);

	const modal = document.getElementById('language-modal');
	const closeBtn = document.getElementById('modal-close-lang');
	
	eventHandlers.modalClickHandler = e => {
		if (e.target === modal) closeLanguageModal();
	};
	
	eventHandlers.closeClickHandler = closeLanguageModal;
	
	modal.addEventListener('click', eventHandlers.modalClickHandler);
	closeBtn.addEventListener('click', eventHandlers.closeClickHandler);
	
	Object.keys(languageConfig).forEach(code => {
		const btn = document.getElementById(`modal-lang-${code}`);
		if (btn) {
			eventHandlers.langClickHandlers[code] = () => {
				btn.classList.add('animate-scaleIn');
				
				const checkIcon = btn.querySelector('.language-check');
				checkIcon?.classList.remove('opacity-0');
				checkIcon?.classList.add('opacity-100', 'animate-pulse');
				
				setTimeout(() => {
					state.setLang(code);
					closeLanguageModal();
				}, 300);
			};
			btn.addEventListener('click', eventHandlers.langClickHandlers[code]);
		}
	});

	feather?.replace();
	updateModalHighlight();
}

export function openLanguageModal() {
	const modal = document.getElementById('language-modal');
	const modalContent = document.getElementById('modal-content');
	
	if (modal) {
		modal.classList.remove('hidden');
		updateModalHighlight();
		
		requestAnimationFrame(() => {
			modal.classList.add('opacity-100');
			modalContent?.classList.remove('scale-95', 'opacity-0');
			modalContent?.classList.add('scale-100', 'opacity-100');
		});
		
		setTimeout(() => feather?.replace(), 50);
	}
}

export function closeLanguageModal() {
	const modal = document.getElementById('language-modal');
	const modalContent = document.getElementById('modal-content');
	
	if (modal && modalContent) {
		modal.classList.remove('opacity-100');
		modalContent.classList.remove('scale-100', 'opacity-100');
		modalContent.classList.add('scale-95', 'opacity-0');
		
		setTimeout(() => modal.classList.add('hidden'), 300);
	}
}

function updateModalHighlight() {
	const current = state.getLang();
	
	Object.keys(languageConfig).forEach(code => {
		const btn = document.getElementById(`modal-lang-${code}`);
		if (!btn) return;
		
		const check = btn.querySelector('.language-check');
		const isActive = code === current;
		
		if (isActive) {
			btn.classList.add('animate-slideInRight');
			setTimeout(() => btn.classList.remove('animate-slideInRight'), 300);
		}
		
		btn.classList.toggle('border-blue-500', isActive);
		btn.classList.toggle('bg-blue-50', isActive);
		btn.classList.toggle('border-gray-200', !isActive);
		check?.classList.toggle('opacity-0', !isActive);
		check?.classList.toggle('opacity-100', isActive);
	});
	
	setTimeout(() => feather?.replace(), 50);
}

export function cleanupLanguageModal() {
	cleanupModalEvents();
	const modal = document.getElementById('language-modal');
	if (modal) modal.remove();
}