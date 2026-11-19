---
title: "デザインエンジニアリング"
categories: ["AI", "Programming"]
tags: ["design-engineering"]
created_at: "2026-11-17"
updated_at: "2026-11-19"
sources: ["../sources/technical/2026-03-16-emil-kowalski-skills.md", "../sources/technical/2026-04-27-hallmark.md", "../sources/technical/2026-03-23-modern-web-guidance.md"]
related: ["../knowledge/design/animation-and-feel-decisions.md", "../knowledge/design/design-corrections-as-rules.md", "../knowledge/design/ai-slop-tells-and-quality-gates.md", "../knowledge/programming/prefer-native-web-platform-features.md"]
---

# デザインエンジニアリング

## 1. 概要

このテーマでは、AI エージェントに UI を作らせる時代に、デザインの質をどう作り、どう保つかをまとめる。中心となる問いは、「エージェントの既定の出力は、そのままでは質が足りない。何を与え、何を検査すれば、人の意図した質になるか」である。

情報源は3件である。Emil Kowalski のスキル集（判断基準の言語化）、Hallmark（slop の検出と品質ゲート）、GoogleChrome/modern-web-guidance（プラットフォーム標準の地図と安全な採用）。いずれも GitHub リポジトリであり、2026-11-17 時点の README をもとに登録した。リポジトリは更新され続けるため、本テーマの記述も時点情報である。

更新履歴：2026-11-17 に、情報源3件と Knowledge 4件をもとに初版を作成した。

## 2. 基本概念

- **デザインエンジニアリング**：デザインの判断と実装の技術を一体として扱う実践。見た目の決定を、再現可能な基準と手順に落とすことが主題になる。
- **センス（taste）**：個々の小さな選択（カーブ、影、余白、言葉）の良し悪しを分ける判断力。Emil Kowalski のスキル集は、エージェントにはこれが不足していると位置づける。
- **slop と tells**：AI 生成物にありがちな均質な型（slop）と、その検出可能な兆候（tells）。Hallmark は tells を列挙し、実ブラウザで lint する。
- **品質ゲート**：納品可否の判定層。Hallmark の Floor（絶対）／Reflex（理由つきで可逆）／Finish（仕上げ）の3層が代表例。
- **デザインシステムと DESIGN.md**：色・書体・余白のトークンと部品を1つに決めて記録し、制作の前提として使い回す仕組み。修正をルール化して蓄積する受け皿でもある。
- **プラットフォーム標準の優先**：ブラウザ標準の機能（dialog、popover、コンテナクエリ、oklch 等）を先に検討し、JS での再実装を後にする考え方。

## 3. 技術・知識の体系

デザインの質を作る仕組みは、次の三つの層で整理できる。

1. **判断の層**：何が良いかの基準を言語化してエージェントに渡す。イージングや影の既定値（[アニメーションと質感の判断基準](../knowledge/design/animation-and-feel-decisions.md)）、標準機能の地図（[Web プラットフォーム標準機能を優先する](../knowledge/programming/prefer-native-web-platform-features.md)）がこの層にあたる。
2. **検品の層**：出力が基準を満たすかを検査する。tells の lint、品質ゲートの適用、最悪ケースデータでの破壊テスト、文脈の新しいレビュアーによる最終確認（[AI 生成 UI の slop サインと品質ゲート](../knowledge/design/ai-slop-tells-and-quality-gates.md)）。
3. **蓄積の層**：修正と判断をルールとして残し、次の制作の前提にする。DESIGN.md への蓄積と pre-flight での読み込み（[デザイン修正をルールとして蓄積する](../knowledge/design/design-corrections-as-rules.md)）。

質は単発の指示ではなく、この3層の循環で作られる。

## 4. 重要な論点

- **小さな判断の複合が質を分ける**。カーブ1つ、影1つは些細でも、画面全体では「素晴らしいか、そうでないか」の差になる。だからこそ、判断基準は列挙して渡す価値がある。
- **「AI っぽさ」は列挙できる**。eyebrow の乱用、1語だけの色変え、空の枠の羅列といった tells は、感覚的な不満ではなく検出項目にできる。不満を項目に分解できるかどうかが、改善の再現性を決める。
- **捏造しないことが床（Floor）に入る**。実在しない数値や素材で画面を埋めることは、見た目の問題ではなく品質ゲートの最下層の違反として扱われる。
- **標準機能の採用は時点判断である**。対応状況（Baseline）は変わるため、「標準を優先する」という方針と「今この機能を使うか」は別の判断である。揮発性機能には明示の同意が要る。
- **知識は配り方も設計対象である**。3件の情報源はいずれも、知識を「全部読ませる」のではなく、必要な分だけを検索・取得させる形（スキル、ガイド CLI、テーマ1ファイル）を取る。文脈の消費を抑える設計が、知識の質の一部になっている。

## 5. 情報源ごとの比較

3件は競合ではなく、役割が異なる。

- **Emil Kowalski のスキル集**：主に「判断の層」を担う。アニメーションと質感の既定値を、間違いと直し方の対で与える。learn-taste により「蓄積の層」にも触れる。範囲は動きと質感に集中し、レイアウトや配色の体系は扱わない。
- **Hallmark**：主に「検品の層」と、テーマ（マテリアル）による見た目の方向づけを担う。ゲートの3層、tells の lint、ヒーロー先行の検証順序、再設計時の欠落防止が核である。影響元として Emil のスキル群や他のデザインスキルを明示しており、この分野の集約点の一つになっている。
- **modern-web-guidance**：主に「判断の層」のうちプラットフォーム知識を担う。262機能のガイドと、安全な採用（フォールバックの作法、Baseline 参照、揮発性機能のゲート）、そしてガイド自体を評価で削る運用が核である。ブラウザベンダー側（Chrome／Edge／Firefox／MDN）が共同でメンテナンスする点で、他の2件（個人・企業の実践）と出自が異なる。

共通点は、「エージェントの既定出力を矯正する知識を、どういう形で配るか」を各々が設計していることである。相違点は、矯正の対象が判断（Emil）、見た目の型と工程（Hallmark）、プラットフォーム知識（MWG）と分かれていることである。

## 6. 関連するKnowledge

- [アニメーションと質感の判断基準](../knowledge/design/animation-and-feel-decisions.md) — イージング、影、振り付け、ジェスチャ、スマホの作法など、動きと質感の既定値。
- [デザイン修正をルールとして蓄積する](../knowledge/design/design-corrections-as-rules.md) — learn-taste と DESIGN.md による、修正のルール化と蓄積の循環。
- [AI 生成 UI の slop サインと品質ゲート](../knowledge/design/ai-slop-tells-and-quality-gates.md) — tells の列挙と、Floor／Reflex／Finish の3層ゲート。
- [Web プラットフォーム標準機能を優先する](../knowledge/programming/prefer-native-web-platform-features.md) — 標準機能の地図と、安全な採用の枠組み。

## 7. 最新の動向

2026年に入ってから、「エージェントにデザインの質を持たせる」ためのスキルやガイドが、個人（Emil Kowalski）、AI 企業（Together AI の Hallmark）、ブラウザベンダー側（modern-web-guidance）から相次いで公開されている。いずれも 2026-03〜04 にリポジトリが作られたもので、この分野の形成はごく最近である。今後、スキルの形式や評価方法の標準化が進むかどうかが観察点である（本節は登録時点の観察であり、断定ではない）。

## 8. 今後の課題・考察

- **自分の制作への適用**：判断基準とゲートを、実際の制作（playground／araru／Space）の検品にどう組み込むか。既にデザイン原則のメモとして共通の土台を別途まとめているが、運用しながら項目を育てる必要がある。
- **tells の陳腐化への追随**：型は変わる。情報源のリポジトリ更新に合わせて、検出項目を見直す機会が要る。
- **情報源の追加**：デザインシステムの運用そのもの（トークンの管理、部品の設計）を扱う情報源がまだない。追加されたら体系とあわせて更新する。

以下はAIによる考察である。3件とも「知識を配る形」まで含めて設計されている点は、ハーネスエンジニアリングの議論と通じる。質の議論が、個人のセンス論から、配布と検証の仕組みの議論へ移りつつあるように見える。

## 9. 参考情報

- [Skills For Designers and Engineers（emilkowalski/skills）](../sources/technical/2026-03-16-emil-kowalski-skills.md) — https://github.com/emilkowalski/skills
- [Hallmark ― AI 生成らしく見せないデザインスキル](../sources/technical/2026-04-27-hallmark.md) — https://github.com/Nutlope/hallmark
- [Modern Web Guidance（GoogleChrome/modern-web-guidance）](../sources/technical/2026-03-23-modern-web-guidance.md) — https://github.com/GoogleChrome/modern-web-guidance
- 更新履歴：2026-11-17 に初版を作成した。
