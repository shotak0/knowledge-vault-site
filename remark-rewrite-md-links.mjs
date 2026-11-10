import { visit } from 'unist-util-visit';
import path from 'node:path';

// knowledge-vault のコンテンツは、他のファイルへのリンクを相対パス＋ `.md` で書く。
// Astro は content collection 内の `.md` リンクを自動では書き換えないため、
// ビルド時にサイト内の URL（base 付き、`.md` なし、末尾スラッシュ付き）へ書き換える。
// 書き換えないもの：絶対 URL、ページ内アンカー、docs の外へのリンク。
const DOCS_DIR = path.resolve(import.meta.dirname, 'src/content/docs');
const BASE = '/knowledge-vault-site';

export default function remarkRewriteMdLinks() {
	return (tree, file) => {
		const filePath = file.path ?? file.history?.[0];
		if (!filePath) return;
		const docDir = path.dirname(path.resolve(filePath));
		visit(tree, 'link', (node) => {
			const url = node.url;
			if (!url) return;
			if (
				url.startsWith('http://') ||
				url.startsWith('https://') ||
				url.startsWith('#') ||
				url.startsWith('mailto:')
			) {
				return;
			}
			const [target, hash] = url.split('#');
			if (!target.endsWith('.md')) return;
			const resolved = path.resolve(docDir, target);
			const rel = path
				.relative(DOCS_DIR, resolved)
				.replace(/\.md$/, '')
				.split(path.sep)
				.join('/');
			// docs の外へのリンクは触らない。
			if (rel.startsWith('..')) return;
			node.url = `${BASE}/${rel}/${hash ? `#${hash}` : ''}`;
		});
	};
}
