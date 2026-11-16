// 知識の概観ページ（src/content/docs/overview.mdx）を自動生成する。
//
// 対象：src/content/docs/sources/ と src/content/docs/knowledge/ 配下の
// Source・Knowledge ファイル。Front Matter の categories / tags を集計する。
//
// - カテゴリ別件数 → レーダーチャート（RadarChart.astro）
//   軸が増えすぎると読めなくなるため、上限は 8 軸。9 種を超えたら
//   件数の少ないカテゴリを「その他」にまとめる。
// - タグ別件数 → Top 10 の横棒グラフ（TagBars.astro）
//   タグは種類が増え続けるため、レーダーにはせず上位だけを棒で見せる。
//
// デプロイ時の `npm run build` の前に prebuild として動くため、
// コンテンツが増えても集計は自動で更新される。
// このスクリプト自体は Node.js の標準ライブラリだけで動く。

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const siteDir = resolve(join(fileURLToPath(import.meta.url), '..', '..'));
const docsDir = join(siteDir, 'src', 'content', 'docs');
const outputPath = join(docsDir, 'overview.mdx');

const MAX_AXES = 8;
const TAG_TOP_N = 10;

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

// generate-source-index.mjs と同じ Front Matter パーサ。
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
			const inner = value.replace(/^\[/, '').replace(/\]$/, '');
			fields[key] = inner
				.split(',')
				.map((item) => unquote(item))
				.filter(Boolean);
		} else if (value === '') {
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

const categoryCounts = new Map();
const tagCounts = new Map();
let sourceCount = 0;
let knowledgeCount = 0;

for (const sub of ['sources', 'knowledge']) {
	const files = await collectMarkdownFiles(join(docsDir, sub));
	for (const file of files) {
		const text = await readFile(file, 'utf-8');
		const fm = parseFrontMatter(text);
		if (!fm.title) continue;
		if (sub === 'sources') sourceCount++;
		else knowledgeCount++;
		for (const c of Array.isArray(fm.categories) ? fm.categories : []) {
			categoryCounts.set(c, (categoryCounts.get(c) ?? 0) + 1);
		}
		for (const t of Array.isArray(fm.tags) ? fm.tags : []) {
			tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1);
		}
	}
}

// 件数の多い順（同数なら名前順）。
const byCount = (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]);

let categories = [...categoryCounts.entries()].sort(byCount);
if (categories.length > MAX_AXES) {
	const kept = categories.slice(0, MAX_AXES - 1);
	const rest = categories.slice(MAX_AXES - 1);
	const restTotal = rest.reduce((sum, [, n]) => sum + n, 0);
	categories = [...kept, ['その他', restTotal]];
}

const topTags = [...tagCounts.entries()].sort(byCount).slice(0, TAG_TOP_N);
const total = sourceCount + knowledgeCount;

const lines = [
	'---',
	'title: 知識の概観',
	'description: 溜まっている知識を、カテゴリとタグの件数で眺めるページ',
	'---',
	'',
	'{/* このファイルは scripts/generate-stats.mjs が自動生成します。直接編集しないこと。 */}',
	'',
	"import RadarChart from '../../components/RadarChart.astro';",
	"import TagBars from '../../components/TagBars.astro';",
	'',
	`現在、情報源 ${sourceCount} 件・Knowledge ${knowledgeCount} 件（合計 ${total} 件）が登録されています。`,
	'',
	'## カテゴリ別の広がり',
	'',
	`Source と Knowledge の件数をカテゴリごとに集計しました（カテゴリは全 ${categoryCounts.size} 種）。`,
	'',
	`<RadarChart data={${JSON.stringify(
		categories.map(([label, value]) => ({ label, value })),
	)}} />`,
	'',
	`## タグ Top ${TAG_TOP_N}`,
	'',
	`全 ${tagCounts.size} 種のタグから、付いているファイルが多い順に ${TAG_TOP_N} 件を表示します。`,
	'',
	`<TagBars tags={${JSON.stringify(topTags)}} />`,
	'',
];

await writeFile(outputPath, lines.join('\n'), 'utf-8');
console.log(
	`知識の概観を生成しました：Source ${sourceCount}件・Knowledge ${knowledgeCount}件 → ${relative(siteDir, outputPath)}`,
);
