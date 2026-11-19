---
id: "src-20261117-005"
title: "Modern Web Guidance（GoogleChrome/modern-web-guidance）"
source_url: "https://github.com/GoogleChrome/modern-web-guidance"
source_type: "technical"
author: "Google Chrome チーム（Microsoft Edge、Mozilla Firefox、MDN の各チームとコミュニティが共同でメンテナンス）"
published_at: "2026-03-23"
created_at: "2026-11-17"
updated_at: "2026-11-17"

categories: ["Programming"]
tags: ["web-platform", "modern-css", "accessibility", "performance", "agent-skills"]

difficulty: ""
importance: ""

status: "processed"

related: ["../../knowledge/programming/prefer-native-web-platform-features.md", "../../topics/design-engineering.md"]
---

# Modern Web Guidance（GoogleChrome/modern-web-guidance）

## 1. 概要

GoogleChrome/modern-web-guidance は、Web プラットフォームの専門知識、ベストプラクティス、ブラウザ互換性データをコーディングエージェントに直接埋め込むためのスキル集である。Google Chrome、Microsoft Edge、Mozilla Firefox、MDN の各チームと Web 開発コミュニティが共同でメンテナンス（steward）している。狙いは、エージェントを「レガシーなパターン」から遠ざけ、モダンな Web プラットフォームの能力を使う解法へ誘導することである。

本稿は 2026-11-17 時点の main（コミット 64a6d708）の README をもとに作成した。リポジトリは更新され続けるため、ガイドの数や内容は今後変わりうる。

## 2. 要約

- **問題意識**：コーディングエージェントは、学習データに大量のレガシーコードが含まれるため、古いパターンに既定で寄りがちである。今ではプラットフォーム標準の高性能な解法がある作業にも、肥大した JavaScript を生成してしまう。API の存在を知っていても、本番品質の実装パターンの密度が不足している。
- **仕組み**：CLI（`npx modern-web-guidance@latest`）が、対象を絞った専門家監修のガイドをエージェントの文脈へ直接返す。search（オフラインの埋め込み＋BM25 でガイドを検索、ネットワーク不要）→ retrieve（ガイド ID で本文取得、コードパターン・落とし穴・フォールバックが文脈に入る）の2段である。
- **規模**：262 のモダン Web 機能をカバーする。CSS & Layout が140、JavaScript & APIs が85、HTML & DOM が37。分野別には accessibility、built-in-ai、forms、performance、privacy、pwa、security、ui-atoms／ui-behaviors／ui-components、user-experience、visual-design などに整理される。
- **中核分野**：UX（View Transitions、入退場アニメーション、スクロール連動）、CSS レイアウト（コンテナクエリ、subgrid、oklch 等のモダン色空間、text-wrap 調整）、性能（INP 診断、scheduler.yield、投機的プリロード）、フォームと UI（Popover API、dialog、アンカー位置指定、:user-invalid、field-sizing）、アクセシビリティ（スクリーンリーダーとキーボード操作可能性）、ブラウザ内蔵 AI（端末上の翻訳・要約・言語検出 API）。
- **安全な採用**：純粋に付加的な強化（古いブラウザでは無視されてよい）と、重要な振る舞い（ダイアログ制御など）を区別し、後者には50行未満の軽い個別フォールバックか条件付きポリフィルを書く。Baseline の互換性データを参照し、Origin Trial や揮発性の高い機能は retrieve 時にゲートして、開発者の明示同意なしに不安定な API を採用させない。
- **効果測定**：評価ハーネスで継続的に校正される。ガイドあり／なしでエージェントの課題達成率を比べ（直近のスナップショットでは +28〜+36 ポイントの向上）、モデルが既に解ける内容はガイドから削る（プルーニング）。ガイドはトークン効率を意識して設計され、スキルパック本体は約205トークンとされる。
- **プライバシー**：匿名の利用情報（導入数、呼び出しエージェント名、ガイド取得 ID、検索クエリ）が Google に送られる。生のユーザープロンプトは収集されない。環境変数 DISABLE_TELEMETRY=1 でオプトアウトできる。

## 3. 背景・前提知識

- **Baseline**：Web プラットフォーム機能のブラウザ対応状況を示すプロジェクト。その互換性データを参照することで、「今その機能を使ってよいか」を時点ごとに判断できる。
- **プログレッシブ・エンハンスメント**：基本機能を全環境で成立させ、対応環境では強化を上乗せする設計方針。本ガイドでは「無視されてよい強化」と「必ず動くべき振る舞い」を区別し、後者にだけ丁寧なフォールバックを用意する。
- **INP（Interaction to Next Paint）**：操作への応答性を測る指標。性能分野のガイドには INP の診断も含まれる。
- **揮発性機能（volatile features）**：単一エンジンで出荷されて3か月以内、または安定化途中の機能。ガイドは検索では見つかるが、取得には明示の許可が要る。

## 4. 詳細解説

導入は `npx modern-web-guidance@latest install` の対話ウィザード、または各エージェント向けのプラグイン形式で行う。インストールなしでも、search／retrieve／legacy-scan（コードベースを走査してモダン化できるレガシーパターンを探す）を試せる。

ガイドのカタログは機能単位で、web-platform-dx の Baseline ページへリンクされる。CSS では container queries、subgrid、oklch／color-mix／light-dark()、@starting-style、scroll-driven animations、anchor positioning、:has()、cascade layers などが並ぶ。HTML & DOM では dialog、details、inert、カスタマイズ可能な select など。プロジェクト設定ファイル .mwgrc で、Origin Trial と揮発性機能の許可をリポジトリ単位（またはユーザー単位）で共有できる。

評価（Evals）の節は、このプロジェクトの姿勢をよく表している。現実的な開発タスク（実在のベースアプリに対する「画像の読み込みを速くして」のような、API 名を含まない依頼）を用意し、Playwright ベースの採点器でソースパターン、計算済みスタイル、実行時 DOM、アクセシビリティ状態を検証する。採点器は黄金解（100%合格が目標）と無改変ベースライン（0%が目標）で校正され、ガイドあり／なしの達成率差（opportunity と uplift）でガイド自体を改善・削減する。

ライセンスは、コードが Apache License 2.0、ガイド文書が CC BY 4.0 である。

## 5. 重要なポイント

- エージェントの「古さ」は、知識の欠落というより訓練データの分布の問題である。対象を絞ったガイドを文脈へ差し込むことで矯正できる。
- 標準機能を優先すると、性能とアクセシビリティがプラットフォーム側から付いてくる。JS での再実装は、その両方を自分で背負うことになる。
- フォールバックは「重いバンドル」ではなく「軽く、場合ごとに考えたもの」が原則。付加的強化と重要振る舞いの区別が出発点である。
- ガイド自体を評価で削る（モデルが既にできることは書かない）という運用は、文脈の無駄を減らす実践として参考になる。
- テレメトリはオプトアウト可能だが既定で送信される。導入時はこの点を確認すべきである。

## 6. 図解

図解は不要。

## 7. 自分なりの考察

以下は AI による考察であり、リポジトリの主張そのものではない。

- 「エージェントが古いパターンに寄る」問題への答えとして、プロンプトの工夫ではなく「検索可能なガイド集＋CLI」という配布形態を選んでいる点が実務的である。文脈に全部を入れず、必要なガイドだけを取得する設計は、トークン効率の観点でも筋がよい。
- 評価でガイドを削る運用は、知識ベース一般にも応用できる。情報源を増やすだけでなく、「もうモデルが知っていること」を間引くことで、文脈の密度を保てる。
- 個別の機能（oklch、container queries 等）の採用可否は Baseline の時点情報に依存する。本稿は考え方の記録であり、実装時の判断はその時点の対応状況で行うべきである。

## 8. 学んだこと

- モダンな Web 機能は262件規模でガイド化されており、dialog／popover／anchor positioning／field-sizing／:user-invalid など、フォーム周りの標準化が進んでいること。
- 「安全な採用」の枠組み：付加的強化と重要振る舞いの区別、50行未満のフォールバック、Baseline 参照、揮発性機能のゲート。
- ガイドの効果を uplift として測り、冗長な助言を削る評価ループの設計。
