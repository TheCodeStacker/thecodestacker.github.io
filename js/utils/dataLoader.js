import { state } from './state.js';
import { parseTelegramMentions } from './textParser.js';

const BASE_URL = 'https://thecodestacker.github.io';
const contentCache = new Map();

const dataRegistry = {
	en: {
		'index': { title: 'Index', icon: 'file-text' },
		'about': { title: 'About', icon: 'info' },
		'account-registration': { title: 'Account Registration', icon: 'user-plus' },
		'consent-required': { title: 'Consent Required', icon: 'check-circle' },
		'usage-rules': { title: 'Usage Rules', icon: 'book-open' },
		'data-collection': { title: 'Data Collection', icon: 'database' },
		'public-tracking-database': { title: 'Public Tracking Database', icon: 'server' },
		'messages-and-media': { title: 'Messages and Media', icon: 'message-square' },
		'media-metadata': { title: 'Media Metadata', icon: 'aperture' },
		'special-policies': { title: 'Special Policies', icon: 'shield' },
		'group-user-data': { title: 'Group User Data', icon: 'users' },
		'group-admin-data-sharing': { title: 'Group Admin Data Sharing', icon: 'share-2' },
		'group-moderation-policy': { title: 'Group Moderation Policy', icon: 'flag' },
		'paid-promotion-in-groups': { title: 'Paid Promotion in Groups', icon: 'dollar-sign' },
		'channel-user-data': { title: 'Channel User Data', icon: 'tv' },
		'channel-admin-data-sharing': { title: 'Channel Admin Data Sharing', icon: 'share-2' },
		'channel-moderation-policy': { title: 'Channel Moderation Policy', icon: 'flag' },
		'paid-promotion-in-channels': { title: 'Paid Promotion in Channels', icon: 'dollar-sign' },
		'child-protection': { title: 'Child Protection', icon: 'heart' },
		'data-security': { title: 'Data Security', icon: 'lock' },
		'intellectual-property': { title: 'Intellectual Property', icon: 'book' },
		'third-party-services': { title: 'Third Party Services', icon: 'link' },
		'third-party-licenses': { title: 'Third Party Licenses', icon: 'file-text' },
		'data-breach-notification': { title: 'Data Breach Notification', icon: 'alert-triangle' },
		'backup-and-recovery': { title: 'Backup and Recovery', icon: 'hard-drive' },
		'data-retention-period': { title: 'Data Retention Period', icon: 'clock' },
		'data-deletion': { title: 'Data Deletion', icon: 'trash-2' },
		'policy-changes': { title: 'Policy Changes', icon: 'refresh-cw' },
		'user-rights': { title: 'User Rights', icon: 'user-check' },
		'transparency-reports': { title: 'Transparency Reports', icon: 'file-text' },
		'admin-response-time': { title: 'Admin Response Time', icon: 'zap' },
		'additional-services': { title: 'Additional Services', icon: 'package' },
		'multi-language-support': { title: 'Multi Language Support', icon: 'globe' },
		'disclaimer-and-limitations': { title: 'Disclaimer and Limitations', icon: 'info' },
		'conclusion': { title: 'Conclusion', icon: 'check' },
		'contact': { title: 'Contact', icon: 'mail' }
	},
	id: {
		'index': { title: 'Indeks', icon: 'file-text' },
		'about': { title: 'Tentang', icon: 'info' },
		'account-registration': { title: 'Pendaftaran Akun', icon: 'user-plus' },
		'consent-required': { title: 'Persetujuan Diperlukan', icon: 'check-circle' },
		'usage-rules': { title: 'Aturan Penggunaan', icon: 'book-open' },
		'data-collection': { title: 'Pengumpulan Data', icon: 'database' },
		'public-tracking-database': { title: 'Database Pelacakan Publik', icon: 'server' },
		'messages-and-media': { title: 'Pesan dan Media', icon: 'message-square' },
		'media-metadata': { title: 'Metadata Media', icon: 'aperture' },
		'special-policies': { title: 'Kebijakan Khusus', icon: 'shield' },
		'group-user-data': { title: 'Data Pengguna Grup', icon: 'users' },
		'group-admin-data-sharing': { title: 'Berbagi Data Admin Grup', icon: 'share-2' },
		'group-moderation-policy': { title: 'Kebijakan Moderasi Grup', icon: 'flag' },
		'paid-promotion-in-groups': { title: 'Promosi Berbayar di Grup', icon: 'dollar-sign' },
		'channel-user-data': { title: 'Data Pengguna Channel', icon: 'tv' },
		'channel-admin-data-sharing': { title: 'Berbagi Data Admin Channel', icon: 'share-2' },
		'channel-moderation-policy': { title: 'Kebijakan Moderasi Channel', icon: 'flag' },
		'paid-promotion-in-channels': { title: 'Promosi Berbayar di Channel', icon: 'dollar-sign' },
		'child-protection': { title: 'Perlindungan Anak', icon: 'heart' },
		'data-security': { title: 'Keamanan Data', icon: 'lock' },
		'intellectual-property': { title: 'Hak Kekayaan Intelektual', icon: 'book' },
		'third-party-services': { title: 'Layanan Pihak Ketiga', icon: 'link' },
		'third-party-licenses': { title: 'Lisensi Pihak Ketiga', icon: 'file-text' },
		'data-breach-notification': { title: 'Notifikasi Pelanggaran Data', icon: 'alert-triangle' },
		'backup-and-recovery': { title: 'Cadangan dan Pemulihan', icon: 'hard-drive' },
		'data-retention-period': { title: 'Periode Penyimpanan Data', icon: 'clock' },
		'data-deletion': { title: 'Penghapusan Data', icon: 'trash-2' },
		'policy-changes': { title: 'Perubahan Kebijakan', icon: 'refresh-cw' },
		'user-rights': { title: 'Hak Pengguna', icon: 'user-check' },
		'transparency-reports': { title: 'Laporan Transparansi', icon: 'file-text' },
		'admin-response-time': { title: 'Waktu Respon Admin', icon: 'zap' },
		'additional-services': { title: 'Layanan Tambahan', icon: 'package' },
		'multi-language-support': { title: 'Dukungan Multi Bahasa', icon: 'globe' },
		'disclaimer-and-limitations': { title: 'Penafian dan Batasan', icon: 'info' },
		'conclusion': { title: 'Kesimpulan', icon: 'check' },
		'contact': { title: 'Kontak', icon: 'mail' }
	}
};

async function fetchMarkdownContent(lang, id) {
	const url = `${BASE_URL}/js/data/${lang}/${id}.md`;
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
		}
		const content = await response.text();
		return content;
	} catch (error) {
		console.error(`Error fetching ${url}:`, error);
		throw error;
	}
}

export async function getDataFiles() {
	const lang = state.getLang();
	const registry = dataRegistry[lang];
	return Object.entries(registry).map(([id, cfg]) => ({ id, title: cfg.title, icon: cfg.icon }));
}

export async function loadDataFile(id) {
	const lang = state.getLang();
	const cacheKey = `${lang}-${id}`;
	if (contentCache.has(cacheKey)) {
		return contentCache.get(cacheKey);
	}
	const cfg = dataRegistry[lang][id];
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