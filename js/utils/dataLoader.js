import { state } from './state.js';
import { parseTelegramMentions } from './textParser.js';
import { buildStructure } from './structureLoader.js';

const BASE_URL = '';
const contentCache = new Map();

async function fetchMarkdownContent(lang, path) {
	const url = `${BASE_URL}/js/data/${lang}/${path}.md`;
	const response = await fetch(url);
	
	if (!response.ok) {
		throw new Error(`Failed to fetch ${url}: ${response.status}`);
	}
	
	return response.text();
}

function flattenRegistry(registry, result = {}) {
	for (const [key, value] of Object.entries(registry)) {
		if (value.type === 'group' && value.children) {
			for (const [subKey, subValue] of Object.entries(value.children)) {
				if (subValue.children) {
					for (const [itemKey, itemData] of Object.entries(subValue.children)) {
						result[itemKey] = itemData;
					}
				} else if (subValue.path) {
					result[subKey] = subValue;
				}
			}
		} else if (value.path) {
			result[key] = value;
		}
	}
	return result;
}

export async function getDataFiles() {
	const lang = state.getLang();
	const registry = await buildStructure(lang);
	const flattened = flattenRegistry(registry);
	return Object.entries(flattened).map(([id, config]) => ({ 
		id, 
		title: config.title, 
		icon: config.icon 
	}));
}

export async function loadDataFile(id) {
	const lang = state.getLang();
	const cacheKey = `${lang}-${id}`;
	
	if (contentCache.has(cacheKey)) {
		return contentCache.get(cacheKey);
	}
	
	const registry = await buildStructure(lang);
	const flattened = flattenRegistry(registry);
	const config = flattened[id];
	
	if (!config) {
		throw new Error(`Configuration not found for page: ${id}`);
	}
	
	let content = await fetchMarkdownContent(lang, config.path);
	content = parseTelegramMentions(content);
	
	marked.setOptions({
		breaks: true,
		gfm: true,
		headerIds: true,
		mangle: false,
		pedantic: false,
		smartLists: true,
		smartypants: true
	});
	
	const result = {
		content: content,
		title: config.title,
		icon: config.icon
	};
	
	contentCache.set(cacheKey, result);
	return result;
}

export function clearCache() {
	contentCache.clear();
}