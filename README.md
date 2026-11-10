# knowledge-vault-site

knowledge-vault（個人のナレッジ管理リポジトリ）のサイトです。Astro + Starlight で作られており、GitHub Pages で公開します。

- 公開 URL：https://shotak0.github.io/knowledge-vault-site/

## このリポジトリについて

記事や投稿などの情報源（Source）の要約と詳細解説、複数の情報源に共通する知識（Knowledge）、テーマごとのまとめ（Topics）、期間ごとのまとめ（Digest）を Markdown で載せています。サイトのコード（Astro の設定やレイアウト）もここにあります。

## ローカルでの実行方法

Node.js v24 と npm 10 が必要です。

```bash
npm install
npm run dev
```

開発サーバーは http://localhost:4321/knowledge-vault-site/ で開きます。

ビルドして確認する場合は、次のコマンドを使います。

```bash
npm run build
```

生成物は `dist/` に出ます。`npm run preview` でビルド結果を確認できます。

## GitHub Pages の有効化方法

1. このリポジトリの Settings → Pages を開く。
2. Build and deployment で「GitHub Actions」を選ぶ。
3. `main` への push で `.github/workflows/deploy.yml` が動き、サイトが公開される。

なお、`.github/workflows/deploy.yml` の `actions/configure-pages` には `enablement: true` を付けてあるので、Pages がまだ有効になっていなくても、ワークフローの実行時に自動で有効になります。

## 情報源一覧

[情報源一覧](https://shotak0.github.io/knowledge-vault-site/all-sources/) は、登録した情報源を「タイトル・要約・記入日・タグ」の表で見るページです。タイトルを選ぶと元の記事や投稿へ移動するので、ブックマークのように使えます。

一覧は `scripts/generate-source-index.mjs` が自動生成します。デプロイ時の `npm run build` の前に `prebuild` として動くので、新しい情報源が増えると、一覧は自動で更新されます。表の内容は Source ファイルにすでにあるものだけを使います（要約は「## 2. 要約」の最初の段落をそのまま使い、新しく AI が文章を作ることはありません）。

## 検索エンジンからの除外

このサイトは検索エンジンのクローラーから除外しています。要約が元記事の再生産のように見えてしまうため、検索結果には出しません。

- `public/robots.txt`：すべてのクローラーに対して `Disallow: /` を指定しています。
- 各ページの `<head>`：`<meta name="robots" content="noindex, nofollow" />` を付けています（`src/components/Head.astro`）。

## その他

- Astro のテレメトリ（匿名の利用状況データの収集）は無効にしています。`ASTRO_TELEMETRY_DISABLED=1` を `package.json` のビルド・開発スクリプトと、`.github/workflows/deploy.yml` に設定しています。
- サイトの UI は日本語です。コンテンツも日本語の Markdown のまま表示します。
- 検索は Starlight 標準の検索（Pagefind）を使っています。
