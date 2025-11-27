import { state } from './state.js';
import { parseTelegramMentions } from './textParser.js';
import { languageConfig } from '../config/languages.js';

const BASE_URL = 'https://thecodestacker.github.io';
const contentCache = new Map();

async function fetchMarkdownContent(lang, id) {
	const url = `${BASE_URL}/js/data/${lang}/${id}.md`;
	const response = await fetch(url);
	if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
	return response.text();
}

export async function getDataFiles() {
	const lang = state.getLang();
	const registry = languageConfig[lang].registry;
	return Object.entries(registry).map(([id, cfg]) => ({ id, title: cfg.title, icon: cfg.icon }));
}

export async function loadDataFile(id) {
	const lang = state.getLang();
	const cacheKey = `${lang}-${id}`;
	if (contentCache.has(cacheKey)) return contentCache.get(cacheKey);
	
	const cfg = languageConfig[lang].registry[id];
	if (!cfg) return null;
	
	try {
		let content = await fetchMarkdownContent(lang, id);
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
		console.error(`Error loading data file ${id}:`, error);
		return null;
	}
}

export function clearCache() {
	contentCache.clear();
}