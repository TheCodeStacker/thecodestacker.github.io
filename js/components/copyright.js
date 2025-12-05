export function renderCopyright() {
	const copyrightElement = document.getElementById('copyright');
	if (!copyrightElement) return;

	const currentYear = new Date().getFullYear();

	copyrightElement.innerHTML = `
		<div class="mt-8 text-center text-sm text-gray-500">
			<p>© ${currentYear} CodeStacker. All rights reserved.</p>
		</div>
	`;
}