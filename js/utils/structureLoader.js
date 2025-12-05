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

	try {
		const response = await fetch(`${BASE_URL}/js/data/manifest.json`);
		if (response.ok) {
			const manifest = await response.json();
			structureCache.set(cacheKey, manifest);
			return manifest;
		}
	} catch (error) {
		console.error('Failed to load manifest.json:', error);
	}
	
	throw new Error('manifest.json not found');
}

function sortByTitle(items) {
	return items.sort((a, b) => {
		// Safe title extraction with fallback
		const titleA = (a.title || a.key || '').toString().toLowerCase();
		const titleB = (b.title || b.key || '').toString().toLowerCase();
		return titleA.localeCompare(titleB);
	});
}

function getTitle(titleData, lang) {
	// Handle different title formats
	if (!titleData) return '';
	
	if (typeof titleData === 'string') {
		return titleData;
	}
	
	if (typeof titleData === 'object') {
		// Try current language first
		if (titleData[lang]) return titleData[lang];
		// Fallback to English
		if (titleData.en) return titleData.en;
		// Fallback to first available language
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

	try {
		const manifest = await loadManifest();
		const structure = {};

		for (const [folderName, folderData] of Object.entries(manifest)) {
			const folder = {
				title: getTitle(folderData.title, lang) || titleCase(folderName),
				icon: folderData.icon || getFolderIcon(folderName),
				type: 'group',
				children: {}
			};

			// Process files in the main folder
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

			// Process subfolders
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

					// Sort subfolder children
					const sortedSubChildren = {};
					const subItems = Object.entries(subfolder.children).map(([k, v]) => ({
						key: k,
						title: v.title,
						...v
					}));
					
					sortByTitle(subItems).forEach(item => {
						const {key, ...rest} = item;
						sortedSubChildren[key] = rest;
					});
					
					subfolder.children = sortedSubChildren;
					folder.children[subfolderName] = subfolder;
				}
			}

			// Sort folder children (separate subfolders and files)
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

			// Sort and add subfolders first
			sortByTitle(subfolders).forEach(item => {
				const {key, ...rest} = item;
				sortedChildren[key] = rest;
			});

			// Sort and add files
			sortByTitle(files).forEach(item => {
				const {key, ...rest} = item;
				sortedChildren[key] = rest;
			});

			folder.children = sortedChildren;
			structure[folderName] = folder;
		}

		// Sort top-level folders
		const sortedStructure = {};
		const topLevelItems = Object.entries(structure).map(([k, v]) => ({
			key: k,
			title: v.title,
			...v
		}));
		
		sortByTitle(topLevelItems).forEach(item => {
			const {key, ...rest} = item;
			sortedStructure[key] = rest;
		});

		structureCache.set(cacheKey, sortedStructure);
		return sortedStructure;
		
	} catch (error) {
		console.error('Error building structure:', error);
		// Return minimal structure to prevent complete failure
		return {
			'terms': {
				title: 'Terms',
				icon: 'file-text',
				type: 'group',
				children: {
					'terms-index': {
						title: 'Welcome',
						icon: 'home',
						path: 'terms/index'
					}
				}
			}
		};
	}
}

export function clearStructureCache() {
	structureCache.clear();
}