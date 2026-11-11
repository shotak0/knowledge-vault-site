// Starlight は Front Matter の title をページ見出し（H1）として描画する。
// 一方、knowledge-vault のコンテンツは本文の先頭にも同じタイトルの H1 を
// 持つため、そのままだと見出しが二重に表示されてしまう。
// ビルド時に、本文先頭の H1 が Front Matter の title と一致する場合に
// 取り除く。vault 側の元ファイルは GitHub 上でも読むものなので、
// ファイル自体は変更せず、サイトのビルド時だけ対処する。

function headingText(node) {
	let text = '';
	const walk = (n) => {
		if (n.type === 'text' || n.type === 'inlineCode') text += n.value;
		if (n.children) n.children.forEach(walk);
	};
	walk(node);
	return text.trim();
}

export default function remarkStripLeadingH1() {
	return (tree, file) => {
		const title = file?.data?.astro?.frontmatter?.title;
		const children = tree.children ?? [];
		// 最初に現れる見出しを探す。対象は本文先頭の H1 だけ。
		const idx = children.findIndex((n) => n.type === 'heading');
		if (idx === -1) return;
		const node = children[idx];
		if (node.depth !== 1) return;
		// 見出しより前に本文らしいノードがある場合は、先頭の H1 ではない。
		if (children.slice(0, idx).some((n) => n.type !== 'html')) return;
		// Front Matter の title と一致しない H1 は本文の一部なので残す。
		// title が取れない場合は、先頭の H1 をそのまま重複とみなす。
		if (title && headingText(node) !== String(title).trim()) return;
		children.splice(idx, 1);
	};
}
