const eventRegistry = new WeakMap();
let backToTopButton = null;
let backToTopObserver = null;

function cleanupEvents(element) {
	const handlers = eventRegistry.get(element);
	if (handlers) {
		handlers.forEach(({ event, handler }) => {
			element.removeEventListener(event, handler);
		});
		eventRegistry.delete(element);
	}
}

function addTrackedEvent(element, event, handler) {
	if (!eventRegistry.has(element)) {
		eventRegistry.set(element, []);
	}
	eventRegistry.get(element).push({ event, handler });
	element.addEventListener(event, handler);
}

export function applyStyles(container) {
	container.querySelectorAll('*').forEach(el => cleanupEvents(el));
	
	if (backToTopButton) {
		cleanupEvents(backToTopButton);
		backToTopButton.remove();
		backToTopButton = null;
	}
	
	if (backToTopObserver) {
		backToTopObserver.disconnect();
		backToTopObserver = null;
	}

	const apply = (selector, className) => {
		container.querySelectorAll(selector).forEach(el => el.className = className);
	};

	apply('h1', 'text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-blue-500');
	apply('h2', 'text-xl md:text-2xl font-bold text-gray-900 mb-5 mt-10 first:mt-0 pb-3 border-b border-gray-200');
	apply('h3', 'text-lg md:text-xl font-semibold text-gray-800 mb-4 mt-8 pl-4 border-l-4 border-blue-500 bg-blue-50 py-2 rounded-r-lg');
	apply('h4', 'text-base md:text-lg font-semibold text-gray-800 mb-3 mt-6');
	apply('h5', 'text-sm md:text-base font-semibold text-gray-700 mb-3 mt-5');
	apply('h6', 'text-xs md:text-sm font-semibold text-gray-700 mb-2 mt-4 uppercase tracking-wide text-blue-600');
	apply('strong', 'font-bold text-gray-900 bg-yellow-100 px-1 py-0.5 rounded');
	apply('a', 'text-blue-600 hover:text-blue-700 underline hover:no-underline transition-colors duration-200');
	apply('hr', 'my-8 border-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent');
	apply('em', 'italic text-gray-700');
	apply('del', 'line-through text-gray-500 opacity-75');
	apply('mark', 'bg-yellow-200 px-1 rounded');
	apply('kbd', 'bg-gray-100 border border-gray-300 px-2 py-0.5 rounded text-xs font-mono shadow-sm');
	apply('abbr', 'border-b border-dotted border-gray-400 cursor-help');
	apply('img', 'max-w-full h-auto rounded-lg shadow-md my-6 border border-gray-200');

	container.querySelectorAll('p').forEach((p, i) => {
		const isMeta = i < 5 && p.querySelector('strong') && p.textContent.includes(':');
		p.className = isMeta 
			? 'mb-3 text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-lg border-l-4 border-blue-500' 
			: 'mb-5 leading-relaxed text-gray-700 text-base';
	});

	container.querySelectorAll('ol').forEach(ol => {
		ol.className = 'space-y-3 mb-6 pl-0';
		ol.querySelectorAll('li').forEach((li, i) => {
			li.className = 'pl-10 relative bg-white hover:bg-blue-50 p-4 rounded-lg border border-gray-200 transition-colors duration-200';
			
			const num = document.createElement('span');
			num.className = 'absolute left-3 top-4 w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center shadow-sm';
			num.textContent = i + 1;
			li.insertBefore(num, li.firstChild);

			const nestedOl = li.querySelector('ol');
			if (nestedOl) {
				nestedOl.className = 'mt-3 space-y-2 pl-0';
				nestedOl.querySelectorAll(':scope > li').forEach((nestedLi, j) => {
					nestedLi.className = 'pl-8 relative bg-gray-50 p-2 rounded-lg';
					const nestedNum = document.createElement('span');
					nestedNum.className = 'absolute left-2 top-2 w-5 h-5 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center';
					nestedNum.textContent = `${i + 1}.${j + 1}`;
					nestedLi.insertBefore(nestedNum, nestedLi.firstChild);
				});
			}
		});
	});

	container.querySelectorAll('ul').forEach(ul => {
		ul.className = 'space-y-2 mb-6 pl-6';
		ul.querySelectorAll(':scope > li').forEach(li => {
			li.className = 'text-gray-700 leading-relaxed list-disc marker:text-blue-600';
			
			const nestedUl = li.querySelector('ul');
			if (nestedUl) {
				nestedUl.className = 'mt-2 space-y-1 pl-6';
				nestedUl.querySelectorAll(':scope > li').forEach(nestedLi => {
					nestedLi.className = 'text-gray-600 list-circle marker:text-blue-500';
				});
			}
		});
	});

	container.querySelectorAll('code').forEach(code => {
		if (code.parentElement.tagName !== 'PRE') {
			code.className = 'bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800';
		}
	});

	container.querySelectorAll('pre').forEach(pre => {
		pre.className = 'relative bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-6 border border-gray-700';
		const code = pre.querySelector('code');
		if (code) code.className = 'font-mono text-sm';
		
		const oldToolbar = pre.querySelector('.code-toolbar');
		if (oldToolbar) oldToolbar.remove();
		
		const toolbar = document.createElement('div');
		toolbar.className = 'code-toolbar absolute top-2 right-2 flex gap-2';
		
		const copyBtn = document.createElement('button');
		copyBtn.className = 'bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs transition-colors duration-200';
		copyBtn.textContent = 'Copy';
		
		const copyHandler = () => {
			navigator.clipboard.writeText(code.textContent);
			copyBtn.textContent = 'Copied!';
			setTimeout(() => copyBtn.textContent = 'Copy', 2000);
		};
		
		addTrackedEvent(copyBtn, 'click', copyHandler);
		
		toolbar.appendChild(copyBtn);
		pre.appendChild(toolbar);
	});

	container.querySelectorAll('blockquote').forEach(bq => {
		bq.className = 'border-l-4 border-blue-500 pl-4 py-2 my-6 bg-blue-50 rounded-r-lg';
		
		bq.querySelectorAll('p').forEach(p => {
			p.className = 'text-gray-700 italic mb-2 last:mb-0';
		});
	});

	container.querySelectorAll('table').forEach(table => {
		const wrapper = document.createElement('div');
		wrapper.className = 'overflow-x-auto mb-6 rounded-lg border border-gray-200 shadow-sm';
		table.parentNode.insertBefore(wrapper, table);
		wrapper.appendChild(table);
		table.className = 'min-w-full divide-y divide-gray-200';
	});

	apply('thead', 'bg-gray-50');
	apply('th', 'px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide');
	apply('tbody', 'bg-white divide-y divide-gray-200');
	apply('td', 'px-4 py-3 text-sm text-gray-700');

	container.querySelectorAll('tbody tr').forEach((tr, i) => {
		tr.className = i % 2 === 0 ? 'bg-white hover:bg-gray-50 transition-colors' : 'bg-gray-50 hover:bg-gray-100 transition-colors';
	});

	container.querySelectorAll('dl').forEach(dl => {
		dl.className = 'space-y-2 mb-6';
		dl.querySelectorAll('dt').forEach(dt => {
			dt.className = 'font-semibold text-gray-900 text-base';
		});
		dl.querySelectorAll('dd').forEach(dd => {
			dd.className = 'ml-4 text-gray-700 text-sm';
		});
	});

	container.querySelectorAll('details').forEach(details => {
		details.className = 'mb-4 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm';
		const summary = details.querySelector('summary');
		if (summary) {
			summary.className = 'cursor-pointer font-semibold text-gray-900 bg-gray-50 px-4 py-3 hover:bg-gray-100 transition-colors duration-200';
		}
		
		const content = Array.from(details.children).filter(el => el.tagName !== 'SUMMARY');
		content.forEach(el => {
			if (el.tagName === 'P') {
				el.classList.add('px-4', 'py-3');
			}
		});
	});

	container.querySelectorAll('a[href^="http"]').forEach(link => {
		link.setAttribute('target', '_blank');
		link.setAttribute('rel', 'noopener noreferrer');
	});

	container.querySelectorAll('img').forEach(img => {
		if (img.alt) {
			const figure = document.createElement('figure');
			figure.className = 'my-6';
			img.parentNode.insertBefore(figure, img);
			figure.appendChild(img);
			
			const caption = document.createElement('figcaption');
			caption.className = 'text-center text-gray-600 text-sm mt-2';
			caption.textContent = img.alt;
			figure.appendChild(caption);
		}
		
		const zoomHandler = () => {
			const overlay = document.createElement('div');
			overlay.className = 'fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer animate-fadeIn';
			
			const closeHandler = () => {
				cleanupEvents(overlay);
				overlay.remove();
			};
			
			addTrackedEvent(overlay, 'click', closeHandler);
			
			const clone = img.cloneNode();
			clone.className = 'max-w-full max-h-full rounded-xl shadow-2xl';
			overlay.appendChild(clone);
			document.body.appendChild(overlay);
		};
		
		addTrackedEvent(img, 'click', zoomHandler);
	});

	container.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
		h.id = h.textContent.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
	});

	backToTopButton = document.createElement('button');
	backToTopButton.className = 'fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white w-12 h-12 rounded-full shadow-lg transition-all duration-200 z-40 opacity-0 pointer-events-none flex items-center justify-center text-xl font-bold hover:scale-110';
	backToTopButton.innerHTML = '↑';
	
	const scrollHandler = () => window.scrollTo({ top: 0, behavior: 'smooth' });
	addTrackedEvent(backToTopButton, 'click', scrollHandler);
	
	document.body.appendChild(backToTopButton);

	backToTopObserver = new IntersectionObserver(
		([e]) => {
			if (e.intersectionRatio < 1) {
				backToTopButton.classList.remove('opacity-0', 'pointer-events-none');
			} else {
				backToTopButton.classList.add('opacity-0', 'pointer-events-none');
			}
		},
		{ threshold: [1] }
	);
	
	const sentinel = document.createElement('div');
	sentinel.style.height = '1px';
	container.prepend(sentinel);
	backToTopObserver.observe(sentinel);
}

export function cleanup() {
	if (backToTopButton) {
		cleanupEvents(backToTopButton);
		backToTopButton.remove();
		backToTopButton = null;
	}
	
	if (backToTopObserver) {
		backToTopObserver.disconnect();
		backToTopObserver = null;
	}
}