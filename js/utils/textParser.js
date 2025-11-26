export function parseTelegramMentions(text) {
	return text.replace(/@(\w+)/g, (match, username) => {
		return `[@${username}](https://t.me/${username})`;
	});
}