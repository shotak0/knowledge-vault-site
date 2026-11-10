// 情報源一覧ページ（src/content/docs/all-sources.md）を自動生成する。
//
// 対象：src/content/docs/sources/ 配下の Source ファイル。
// 表の内容は、Source ファイルにすでにあるものだけを使う（新しく AI が文章を作らない）。
// - タイトル：Front Matter の title。元の記事 URL（source_url）へリンクする。
// - 要約：「## 2. 要約」の最初の段落をそのまま使う（概要のコピペ）。
// - 記入日：Front Matter の created_at。
// - タグ：Front Matter の tags。
//
// デプロイ時の `npm run build` の前に prebuild として動くため、
// 新しい Source が増えても、一覧は自動で更新される。
// このスクリプト自体は Node.js の標準ライブラリだけで動く。

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const siteDir = resolve(join(fileURLToPath(import.meta.url), '..', '..'));
const sourcesDir = join(siteDir, 'src', 'content', 'docs', 'sources');
const outputPath = join(siteDir, 'src', 'content', 'docs', 'all-sources.md');

async function collectMarkdownFiles(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await collectMarkdownFiles(path)));
		} else if (entry.name.endsWith('.md')) {
			files.push(path);
		}
	}
	return files.sort();
}

function unquote(value) {
	const trimmed = value.trim();
	if (
		(trimmed.startsWith('"') && trimmed.endsWith('"')) ||
		(trimmed.startsWith("'") && trimmed.endsWith("'"))
	) {
		return trimmed.slice(1, -1);
	}
	return trimmed;
}

function parseFrontMatter(text) {
	const match = text.match(/^---\n([\s\S]*?)\n---\n/);
	if (!match) return {};
	const fields = {};
	const lines = match[1].split('\n');
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const keyMatch = line.match(/^([A-Za-z_]+):\s*(.*)$/);
		if (!keyMatch) continue;
		const key = keyMatch[1];
		const value = keyMatch[2].trim();
		if (value.startsWith('[')) {
			// フローリスト：["a", "b"]
			const inner = value.replace(/^\[/, '').replace(/\]$/, '');
			fields[key] = inner
				.split(',')
				.map((item) => unquote(item))
				.filter(Boolean);
		} else if (value === '') {
			// ブロックリスト：次の行の "- 項目" を集める
			const items = [];
			while (i + 1 < lines.length && /^\s*-\s+/.test(lines[i + 1])) {
				i++;
				items.push(unquote(lines[i].replace(/^\s*-\s+/, '')));
			}
			fields[key] = items;
		} else {
			fields[key] = unquote(value);
		}
	}
	return fields;
}

function extractSummary(text) {
	// 「## 2. 要約」の最初の段落をそのまま使う。
	const match = text.match(/^## 2\. 要約\n+([\s\S]*?)(?:\n\n|\n## )/m);
	if (!match) return '';
	let paragraph = match[1].replace(/\s+/g, ' ').trim();
	// 表の中で崩れないよう、Markdown の装飾を外す。
	paragraph = paragraph
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/\*\*([^*]+)\*\*/g, '$1')
		.replace(/\|/g, '｜');
	return paragraph;
}

function escapeCell(text) {
	return String(text ?? '').replace(/\|/g, '｜').replace(/\n/g, ' ');
}

const files = await collectMarkdownFiles(sourcesDir);
const rows = [];
for (const file of files) {
	const text = await readFile(file, 'utf-8');
	const frontMatter = parseFrontMatter(text);
	if (!frontMatter.title) continue;
	rows.push({
		title: frontMatter.title,
		sourceUrl: frontMatter.source_url ?? '',
		summary: extractSummary(text),
		createdAt: frontMatter.created_at ?? '',
		tags: Array.isArray(frontMatter.tags) ? frontMatter.tags : [],
	});
}

// 記入日が新しい順、同じ日ならタイトル順。
rows.sort((a, b) => {
	if (a.createdAt !== b.createdAt) return b.createdAt.localeCompare(a.createdAt);
	return a.title.localeCompare(b.title, 'ja');
});

const lines = [
	'---',
	'title: 情報源一覧',
	'description: 登録した情報源を、タイトル・要約・記入日・タグの一覧表で見るページ',
	'---',
	'',
	'<!-- このファイルは scripts/generate-source-index.mjs が自動生成します。直接編集しないこと。 -->',
	'',
	'# 情報源一覧',
	'',
	`現在 ${rows.length}件の情報源があります。タイトルを選ぶと、元の記事や投稿へ移動します。`,
	'',
	'| タイトル | 要約 | 記入日 | タグ |',
	'| --- | --- | --- | --- |',
];
for (const row of rows) {
	const title = row.sourceUrl
		? `[${escapeCell(row.title)}](${row.sourceUrl})`
		: escapeCell(row.title);
	const tags = row.tags.map((tag) => `\`${escapeCell(tag)}\``).join(' ');
	lines.push(
		`| ${title} | ${escapeCell(row.summary)} | ${escapeCell(row.createdAt)} | ${tags} |`,
	);
}
lines.push('');

await writeFile(outputPath, lines.join('\n'), 'utf-8');
console.log(
	`情報源一覧を生成しました：${rows.length}件 → ${relative(siteDir, outputPath)}`,
);
