import { state } from './state.js';
import { parseTelegramMentions } from './textParser.js';
import { buildStructure } from './structureLoader.js';
import { errorHandler } from './errorHandler.js';

const BASE_URL = '';
const contentCache = new Map();

async function fetchMarkdownContent(lang, path) {
	try {
		const url = `${BASE_URL}/js/data/${lang}/${path}.md`;
		const response = await fetch(url);
		
		if (!response.ok) {
			throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
		}
		
		return response.text();
	} catch (error) {
		errorHandler.handleError(error, {
			type: 'fetch_markdown',
			location: 'fetchMarkdownContent',
			lang,
			path
		});
		throw error;
	}
}

function flattenRegistry(registry, result = {}) {
	try {
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
	} catch (error) {
		errorHandler.handleError(error, {
			type: 'flatten_registry',
			location: 'flattenRegistry'
		});
		return result;
	}
}

export async function getDataFiles() {
	try {
		const lang = state.getLang();
		const registry = await buildStructure(lang);
		const flattened = flattenRegistry(registry);
		return Object.entries(flattened).map(([id, cfg]) => ({ 
			id, 
			title: cfg.title, 
			icon: cfg.icon 
		}));
	} catch (error) {
		errorHandler.handleError(error, {
			type: 'get_data_files',
			location: 'getDataFiles'
		});
		return [];
	}
}

export async function loadDataFile(id) {
	try {
		const lang = state.getLang();
		const cacheKey = `${lang}-${id}`;
		
		if (contentCache.has(cacheKey)) {
			return contentCache.get(cacheKey);
		}
		
		const registry = await buildStructure(lang);
		const flattened = flattenRegistry(registry);
		const cfg = flattened[id];
		
		if (!cfg) {
			throw new Error(`Configuration not found for page: ${id}`);
		}
		
		let content = await fetchMarkdownContent(lang, cfg.path);
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
			title: cfg.title,
			icon: cfg.icon
		};
		
		contentCache.set(cacheKey, result);
		return result;
		
	} catch (error) {
		errorHandler.handleError(error, {
			type: 'load_data_file',
			location: 'loadDataFile',
			id,
			lang: state.getLang()
		});
		throw error;
	}
}

export function clearCache() {
	contentCache.clear();
}