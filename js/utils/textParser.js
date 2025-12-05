export function parseTelegramMentions(text) {
	if (typeof text !== 'string') {
		return text;
	}

	return text.replace(/@(\w+)/g, (match, username) => {
		return `[@${username}](https://t.me/${username})`;
	});
}