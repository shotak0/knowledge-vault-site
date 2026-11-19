---
id: "src-20261117-003"
title: "Skills For Designers and Engineers（emilkowalski/skills）"
source_url: "https://github.com/emilkowalski/skills"
source_type: "technical"
author: "Emil Kowalski"
published_at: "2026-03-16"
created_at: "2026-11-17"
updated_at: "2026-11-19"

categories: ["Design"]
tags: ["design-engineering", "animation", "agent-skills", "ui-design"]

difficulty: ""
importance: ""

status: "processed"

related: ["../../knowledge/design/animation-and-feel-decisions.md", "../../knowledge/design/design-corrections-as-rules.md", "../../topics/design-engineering.md"]
---

# Skills For Designers and Engineers（emilkowalski/skills）

## 1. 概要

Emil Kowalski（Vercel、Linear での勤務経験を持つデザイナー／エンジニア）による、コーディングエージェント向けスキルの GitHub リポジトリである。デザインとアニメーションの判断基準を、エージェントが犯しがちな間違いとその直し方の形でスキル化したものが収録されている。リポジトリの説明によれば、これらのスキルは同氏の長年の実務経験の「副産物」であり、「AI は専門知識を置き換えるのではなく、増幅する」という立場を取る。

本稿は 2026-11-17 時点の main（コミット 64eb3deb）の README をもとに作成した。リポジトリは更新され続けるため、スキル構成や内容は今後変わりうる。

## 2. 要約

- **中心的な主張**：エージェントには「センス（taste）」が不足している。入場アニメーションに ease-in を選ぶ（正しくは ease-out）、UI の境界にベタ塗りの線を選ぶ（半透明の影の方がよい）といった小さな誤選択が積み重なり、インターフェースの質を分ける。
- **スキルの形**：各スキルは「エージェントが犯しうる小さな間違いの一覧と、その直し方」で構成される。判断を丸ごと委ねるのではなく、間違いのパターンを先回りで潰す形式である。
- **収録スキル**：中核の emil-design-eng（アニメーション中心＋デザイン助言）のほか、アニメーションを作る animate、厳しくレビューする review-animations、コードベース全体を監査して優先順位つき改善計画を出す improve-animations、動きが要る場所を探す find-animation-opportunities、不要なアニメーションを消す remove-animations、複数要素の振り付け choreograph、フレーム落ちを直す animation-performance、Apple の設計原則を Web 向けに訳した apple-design、指に 1:1 で追随するジェスチャ gestures、スマホでネイティブらしく感じさせる mobile-native、最悪ケースのデータで UI を壊しにいく break-ui、セッション中のデザイン修正を DESIGN.md のルールに変える learn-taste など。
- **前提**：コードやデザインの専門知識そのものを学ぶことが依然として価値を持つ、という立場が明記されている。

## 3. 背景・前提知識

- **Agent Skills**：エージェントにドメイン知識や手順を SKILL.md 等の形で与える仕組み。本リポジトリは `npx skills add` で導入する形式を取る。
- **イージング**：アニメーションの加減速カーブ。要素が現れる入場では、速く始まって滑らかに止まる ease-out が自然に感じられ、逆に ease-in は「反応が鈍い」印象になりやすい、というのが同氏の説明である。
- **learn-taste の DESIGN.md**：プロジェクトに置くデザイン判断の記録ファイル。セッションで受けた修正（利用者自身の手直しを含む）を集め、それぞれ理由つきのルールに変換して残すことで、次のエージェントが同じ間違いを繰り返さないようにする。

## 4. 詳細解説

リポジトリの README は、スキルの導入方法（`npx skills@latest add emilkowalski/skills`）と、各スキルの一覧・用途を提示する構成である。あわせてリポジトリ直下には ui-cheatsheet.md と performance-cheatsheet.md が置かれている。

「Why use it?」の節では、エージェントのセンス不足が具体例で示される。入場アニメーションへの ease-in の誤用、境界へのベタ塗り線の選択など、「どれも小さいが、複合するとインターフェースが素晴らしくなるか、そうでなくなるかを分ける」と述べる。

スキル群はアニメーションを中心に、作る（animate）、直す（animation-performance）、見直す（review-animations、improve-animations）、足す場所と引く場所を判断する（find-animation-opportunities、remove-animations）という、運用の全相をカバーする。remove-animations は「キーボードショートカットへの動き、全セクションへのフェードイン、ツールチップ群への一律の遅延」のような、不要な動きを消す側のスキルであり、足すだけが設計ではないという姿勢が表れている。

モバイル向けには mobile-native（スティッキーになるホバー、タップハイライトの閃光、100vh 問題、入力時ズーム、タップの遅延、セーフエリアなど）と gestures（指への 1:1 追随、離した速度の引き継ぎ、途中キャッチ可能なアニメーション）、React Native／Expo 向けの animate-expo がある。

また break-ui は、最悪ケースのデータ（長い名前、特殊なメールアドレス、1文字の名前、巨大な件数、空リスト、長いラベル）で自作 UI を壊しにいく検証スキルである。learn-taste はセッションの終わりに走らせるもので、デザイン修正を理由つきルールとして DESIGN.md に蓄積する。

## 5. 重要なポイント

- エージェントの出力品質は、モデル性能だけでなく「間違いパターンの事前列挙」で大きく改善できる。
- アニメーションの質は、カーブ・時間・対象プロパティの選択という小さな判断の集積である。
- 「足す」スキルと「消す」スキルが対で用意されている。動きは目的がある場所だけに使う。
- 修正の履歴をルール化して残す（DESIGN.md）ことで、改善がセッションを跨いで蓄積する。
- 実務家本人の言葉として「専門知識は AI に置き換えられず、増幅される」という前提が置かれている。

## 6. 図解

図解は不要。

## 7. 自分なりの考察

以下は AI による考察であり、リポジトリの主張そのものではない。

- このリポジトリの形式は、ハーネスエンジニアリングの考え方とよく重なる。モデルへの指示ではなく、失敗パターンの列挙と検証（break-ui）という環境側の設計で品質を作っている。
- learn-taste の「修正をルール化する」発想は、個人の制作フローにもそのまま転用できる。デザインの決定理由を rationale として残す運用と相性がよい。
- 収録スキルの大半はアニメーション特化であり、レイアウトや配色の体系そのものではない。土台のデザインシステムは別途必要である。

## 8. 学んだこと

- 入場アニメーションは ease-out、境界はベタ塗り線より半透明の影、といった具体的な既定値を得た。
- アニメーションには「足す」判断と「消す」判断の両方があり、レビュー・監査のスキルとして分離できることを学んだ。
- セッション中の修正を理由つきルールに変換して残す learn-taste の仕組みは、エージェントとの共同作業全般に応用できる。
