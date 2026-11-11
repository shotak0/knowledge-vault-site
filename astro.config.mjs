import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import remarkRewriteMdLinks from './remark-rewrite-md-links.mjs';
import remarkStripLeadingH1 from './remark-strip-leading-h1.mjs';

// knowledge-vault の表示専用サイト。
// https://astro.build/config
export default defineConfig({
	site: 'https://shotak0.github.io',
	base: '/knowledge-vault-site',
	markdown: {
		// コンテンツ内の相対 `.md` リンクをサイト内 URL へ書き換える。
		// 本文先頭の H1 は、Starlight が描画するページ見出しと重複するため取り除く。
		remarkPlugins: [remarkRewriteMdLinks, remarkStripLeadingH1],
	},
	integrations: [
		starlight({
			title: 'knowledge-vault',
			favicon: '/favicon.svg',
			description: '個人の知識・情報・知見を蓄積するナレッジ管理リポジトリの表示サイト',
			// Starlight 0.42 では、locales を定義しないと defaultLocale の指定だけでは
			// 日本語にならない（ビルトインの既定ロケール＝英語が使われる）。
			// 単一言語の日本語サイトは、root ロケールで定義するのが公式の書き方。
			defaultLocale: 'root',
			locales: {
				root: { label: '日本語', lang: 'ja' },
			},
			components: {
				// Mermaid 図解を描画するために Head を上書きする。
				Head: './src/components/Head.astro',
			},
			sidebar: [
				{
					label: '情報源',
					items: [{ autogenerate: { directory: 'sources' } }],
				},
				{
					label: 'Knowledge',
					items: [{ autogenerate: { directory: 'knowledge' } }],
				},
				{
					label: 'Topics',
					items: [{ autogenerate: { directory: 'topics' } }],
				},
				{
					label: 'Digest',
					items: [{ autogenerate: { directory: 'digests' } }],
				},
				{
					label: '情報源一覧',
					link: '/all-sources/',
				},
			],
		}),
	],
});
