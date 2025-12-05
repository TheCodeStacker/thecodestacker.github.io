import { errorHandler } from './errorHandler.js';

export function parseTelegramMentions(text) {
	try {
		if (typeof text !== 'string') {
			return text;
		}

		return text.replace(/@(\w+)/g, (match, username) => {
			return `[@${username}](https://t.me/${username})`;
		});
	} catch (error) {
		errorHandler.handleError(error, {
			type: 'parse_telegram_mentions',
			location: 'textParser.parseTelegramMentions',
			textLength: text?.length
		});
		return text;
	}
}