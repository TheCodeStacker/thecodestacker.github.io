export const folderConfig = {
	terms: {
		icon: 'file-text'
	},
	tutorials: {
		icon: 'book-open'
	},
	blogs: {
		icon: 'bookmark'
	}
};

export const defaultIcon = 'file';

export function getFolderIcon(folderName) {
	return folderConfig[folderName]?.icon || defaultIcon;
}