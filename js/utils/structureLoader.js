import { getFolderIcon } from '../config/structure.js';

const structureCache = new Map();
const BASE_URL = '';

function titleCase(str) {
	return str
		.split(/[-_]/)
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

async function loadManifest() {
	const cacheKey = 'manifest';
	if (structureCache.has(cacheKey)) {
		return structureCache.get(cacheKey);
	}

	const response = await fetch(`${BASE_URL}/js/data/manifest.json`);
	
	if (!response.ok) {
		throw new Error(`Failed to fetch manifest.json: ${response.status}`);
	}
	
	const manifest = await response.json();
	structureCache.set(cacheKey, manifest);
	return manifest;
}

function sortByTitle(items) {
	return items.sort((a, b) => {
		const titleA = (a.title || a.key || '').toString().toLowerCase();
		const titleB = (b.title || b.key || '').toString().toLowerCase();
		return titleA.localeCompare(titleB);
	});
}

function getTitle(titleData, lang) {
	if (!titleData) return '';
	
	if (typeof titleData === 'string') {
		return titleData;
	}
	
	if (typeof titleData === 'object') {
		if (titleData[lang]) return titleData[lang];
		if (titleData.en) return titleData.en;
		const firstKey = Object.keys(titleData)[0];
		if (firstKey) return titleData[firstKey];
	}
	
	return '';
}

export async function buildStructure(lang) {
	const cacheKey = `structure-${lang}`;
	
	if (structureCache.has(cacheKey)) {
		return structureCache.get(cacheKey);
	}

	const manifest = await loadManifest();
	const structure = {};

	for (const [folderName, folderData] of Object.entries(manifest)) {
		const folder = {
			title: getTitle(folderData.title, lang) || titleCase(folderName),
			icon: folderData.icon || getFolderIcon(folderName),
			type: 'group',
			children: {}
		};

		if (folderData.files) {
			for (const [fileName, fileData] of Object.entries(folderData.files)) {
				const fileKey = `${folderName}-${fileName}`;
				folder.children[fileKey] = {
					title: getTitle(fileData.title, lang) || titleCase(fileName),
					icon: fileData.icon || 'file',
					path: `${folderName}/${fileName}`
				};
			}
		}

		if (folderData.subfolders) {
			for (const [subfolderName, subfolderData] of Object.entries(folderData.subfolders)) {
				const subfolder = {
					title: getTitle(subfolderData.title, lang) || titleCase(subfolderName),
					icon: subfolderData.icon || 'folder',
					children: {}
				};

				if (subfolderData.files) {
					for (const [fileName, fileData] of Object.entries(subfolderData.files)) {
						const fileKey = `${folderName}-${subfolderName}-${fileName}`;
						subfolder.children[fileKey] = {
							title: getTitle(fileData.title, lang) || titleCase(fileName),
							icon: fileData.icon || 'file',
							path: `${folderName}/${subfolderName}/${fileName}`
						};
					}
				}

				const sortedSubChildren = {};
				const subItems = Object.entries(subfolder.children).map(([key, value]) => ({
					key: key,
					title: value.title,
					...value
				}));
				
				sortByTitle(subItems).forEach(item => {
					const {key, ...rest} = item;
					sortedSubChildren[key] = rest;
				});
				
				subfolder.children = sortedSubChildren;
				folder.children[subfolderName] = subfolder;
			}
		}

		const sortedChildren = {};
		const subfolders = [];
		const files = [];

		for (const [key, child] of Object.entries(folder.children)) {
			const item = {
				key: key,
				title: child.title,
				...child
			};
			
			if (child.children) {
				subfolders.push(item);
			} else {
				files.push(item);
			}
		}

		sortByTitle(subfolders).forEach(item => {
			const {key, ...rest} = item;
			sortedChildren[key] = rest;
		});

		sortByTitle(files).forEach(item => {
			const {key, ...rest} = item;
			sortedChildren[key] = rest;
		});

		folder.children = sortedChildren;
		structure[folderName] = folder;
	}

	const sortedStructure = {};
	const topLevelItems = Object.entries(structure).map(([key, value]) => ({
		key: key,
		title: value.title,
		...value
	}));
	
	sortByTitle(topLevelItems).forEach(item => {
		const {key, ...rest} = item;
		sortedStructure[key] = rest;
	});

	structureCache.set(cacheKey, sortedStructure);
	return sortedStructure;
}

export function clearStructureCache() {
	structureCache.clear();
}