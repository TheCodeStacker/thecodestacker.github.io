import { state } from '../utils/state.js';
import { languageConfig } from '../config/languages.js';

const backgroundColors = [
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
	const closeButton = document.getElementById('modal-close-lang');
	
	if (modal && eventHandlers.modalClickHandler) {
		modal.removeEventListener('click', eventHandlers.modalClickHandler);
	}
	
	if (closeButton && eventHandlers.closeClickHandler) {
		closeButton.removeEventListener('click', eventHandlers.closeClickHandler);
	}
	
	Object.keys(eventHandlers.langClickHandlers).forEach(code => {
		const button = document.getElementById(`modal-lang-${code}`);
		if (button && eventHandlers.langClickHandlers[code]) {
			button.removeEventListener('click', eventHandlers.langClickHandlers[code]);
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
	let index = 0;
	
	for (const [code, lang] of Object.entries(languageConfig)) {
		const flag = getFlag(lang.countryCode);
		const background = backgroundColors[index++ % backgroundColors.length];
		
		buttons += `
			<button id="modal-lang-${code}" class="w-full p-4 rounded-2xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition" data-lang="${code}">
				<div class="flex items-center gap-4">
					<div class="w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm" style="background:${background}">
						<span style="font-size:2.5rem">${flag}</span>
					</div>
					<div class="flex-1 text-left">
						<div class="font-bold text-lg text-gray-900">${lang.name}</div>
						<div class="text-sm text-gray-500">${lang.nativeName}</div>
					</div>
					<div class="language-check opacity-0 transition">
						<i data-feather="check-circle" class="w-7 h-7 text-blue-500"></i>
					</div>
				</div>
			</button>
		`;
	}

	document.body.insertAdjacentHTML('beforeend', `
		<div id="language-modal" class="hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition opacity-0">
			<div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg transform transition scale-95 opacity-0" id="modal-content">
				<div class="p-8 text-center border-b border-gray-100">
					<h2 class="text-3xl font-black text-gray-900 mb-2">Choose Language</h2>
					<p class="text-gray-500">Select your preferred language</p>
				</div>
				<div class="p-6">
					<div class="space-y-3">${buttons}</div>
				</div>
				<div class="p-6 border-t border-gray-100">
					<button id="modal-close-lang" class="w-full py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl font-semibold transition">Cancel</button>
				</div>
			</div>
		</div>
	`);

	const modal = document.getElementById('language-modal');
	const closeButton = document.getElementById('modal-close-lang');
	
	if (!modal || !closeButton) return;
	
	eventHandlers.modalClickHandler = event => {
		if (event.target === modal) closeLanguageModal();
	};
	
	eventHandlers.closeClickHandler = () => {
		closeLanguageModal();
	};
	
	modal.addEventListener('click', eventHandlers.modalClickHandler);
	closeButton.addEventListener('click', eventHandlers.closeClickHandler);
	
	Object.keys(languageConfig).forEach(code => {
		const button = document.getElementById(`modal-lang-${code}`);
		if (button) {
			eventHandlers.langClickHandlers[code] = () => {
				const checkIcon = button.querySelector('.language-check');
				if (checkIcon) {
					checkIcon.classList.remove('opacity-0');
					checkIcon.classList.add('opacity-100');
				}
				
				setTimeout(() => {
					state.setLang(code);
					closeLanguageModal();
				}, 300);
			};
			button.addEventListener('click', eventHandlers.langClickHandlers[code]);
		}
	});

	if (typeof feather !== 'undefined' && feather.replace) {
		feather.replace();
	}
	
	updateModalHighlight();
}

export function openLanguageModal() {
	const modal = document.getElementById('language-modal');
	const modalContent = document.getElementById('modal-content');
	
	if (!modal || !modalContent) return;
	
	modal.classList.remove('hidden');
	updateModalHighlight();
	
	requestAnimationFrame(() => {
		modal.classList.remove('opacity-0');
		modal.classList.add('opacity-100');
		modalContent.classList.remove('scale-95', 'opacity-0');
		modalContent.classList.add('scale-100', 'opacity-100');
	});
	
	setTimeout(() => {
		if (typeof feather !== 'undefined' && feather.replace) {
			feather.replace();
		}
	}, 50);
}

export function closeLanguageModal() {
	const modal = document.getElementById('language-modal');
	const modalContent = document.getElementById('modal-content');
	
	if (!modal || !modalContent) return;
	
	modal.classList.remove('opacity-100');
	modal.classList.add('opacity-0');
	modalContent.classList.remove('scale-100', 'opacity-100');
	modalContent.classList.add('scale-95', 'opacity-0');
	
	setTimeout(() => modal.classList.add('hidden'), 300);
}

function updateModalHighlight() {
	const current = state.getLang();
	
	Object.keys(languageConfig).forEach(code => {
		const button = document.getElementById(`modal-lang-${code}`);
		if (!button) return;
		
		const check = button.querySelector('.language-check');
		const isActive = code === current;
		
		if (isActive) {
			button.classList.add('border-blue-500', 'bg-blue-50');
			button.classList.remove('border-gray-200');
			if (check) {
				check.classList.remove('opacity-0');
				check.classList.add('opacity-100');
			}
		} else {
			button.classList.add('border-gray-200');
			button.classList.remove('border-blue-500', 'bg-blue-50');
			if (check) {
				check.classList.remove('opacity-100');
				check.classList.add('opacity-0');
			}
		}
	});
	
	setTimeout(() => {
		if (typeof feather !== 'undefined' && feather.replace) {
			feather.replace();
		}
	}, 50);
}

export function cleanupLanguageModal() {
	cleanupModalEvents();
	const modal = document.getElementById('language-modal');
	if (modal) modal.remove();
}