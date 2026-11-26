# 株式会社山村書店 公式サイト

岐阜県安八郡神戸町にある書店・教科書取扱店のコーポレートサイトです。

**公開URL:** https://www.yamamurabook.shop/

運用ルール（デプロイ・URL設計・作業手順）は [CLAUDE.md](./CLAUDE.md) を参照してください。

---

## ページ一覧

| ファイル | URL | ページ名 |
|---|---|---|
| index.html | / | トップページ |
| news.html | /news | お知らせ |
| access.html | /access | 利用案内（店舗・倉庫情報） |
| company.html | /company | 会社概要 |
| recruit.html | /recruit | 採用情報 |
| faq.html | /faq | よくあるご質問 |
| contact.html | /contact | お問い合わせ |
| sakasaew.html | /sakasaew | 長女の部屋 |
| privacypolicy.html | /privacypolicy | プライバシーポリシー |
| tokushoho.html | /tokushoho | 特定商取引法に基づく表記 |

新しいページを追加するときは `_redirects` と `sitemap.xml` も更新してください。

## 技術スタック

- 静的HTML（フレームワーク不使用）
- [Tailwind CSS](https://tailwindcss.com/) 3.4（ローカルビルド）
- [Noto Sans JP](https://fonts.google.com/noto/specimen/Noto+Sans+JP)（Google Fonts）
- お問い合わせフォーム：Google Apps Script（`assets/contact.js` から送信。送信先コードはこのリポジトリには含まれない）。営業・ボット対策として、注意書き・「営業目的ではない」必須チェック・Cloudflare Turnstile を設置（検証は送信先の GAS 側でも行う）
- ホスティング：Cloudflare Pages（`main` への push で自動デプロイ）

## CSSのビルド

スタイルは `assets/tailwind-input.css` に書き、ビルドして `assets/tailwind.css` を生成します。`tailwind.css` は自動生成ファイルなので直接編集しません。

```
npm run build:css      # 1回ビルド
npm run watch:css      # 監視ビルド
```

## お問い合わせフォームの営業・ボット対策

フォーム経由の営業・売り込みを抑止するため、次の3つを入れています（2026-11-24 導入）。

| 対策 | 場所 | 内容 |
|---|---|---|
| 注意書き | `contact.html` | フォーム上部に「営業・売り込みを目的としたご連絡はお控えください。」 |
| 必須チェック | `contact.html` / GAS | 「営業・売り込みを目的としたものではありません」。チェック時のみ `no_solicitation=yes` を送信し、GAS でも検証する |
| Cloudflare Turnstile | `contact.html` / `contact.js` / GAS | トークンを `cf-turnstile-response` として送信し、GAS が Cloudflare に問い合わせて検証する。トークンが取れない場合は `contact.js` が送信を止め、メールでの連絡を案内する |

### Turnstile ウィジェットは、さかさま（sakasaew.com）と共有
- サイトキー：`0x4AAAAAAGM0nCkbvmB-shup`（公開してよい値。`contact.html` に記載）
- シークレットキーは、GAS のスクリプトプロパティ `TURNSTILE_SECRET` にだけ保存している。**リポジトリやチャットには書かない**。
- ウィジェットのホスト名（Cloudflare ダッシュボード → Turnstile）に `yamamurabook.shop` が登録されている。登録のないドメイン（`*.pages.dev` のプレビューなど）では、ウィジェットがエラーになり送信できないため、確認は本番で行う。
- **⚠️ シークレットキーを再発行するときは、さかさまと山村書店の両方の GAS の `TURNSTILE_SECRET` を同時に更新すること。** 片方だけ古いと、その GAS への送信がすべて破棄される（サイトの画面には「送信完了」と出る）。

### 送信先（GAS）側
- 検証コードは GAS 側にあり、このリポジトリには含まれない。`ENFORCE_BOT_CHECK = true` で本番運用中。
- 検証をスキップした場合（権限・シークレットキー・通信の不具合）は、`info@yamamurabook.shop` に「検証をスキップしました」のメールが届く。届いたら、GAS の `testSiteverify` を実行して確認する。
- ご用件は自由入力で、GAS に種別の許可リスト（`CATEGORIES`）は無い。
- CSP（`_headers`）で `challenges.cloudflare.com` を許可している。Turnstile を外す場合は、あわせて許可を外す。

## ブランドカラー

`tailwind.config.js` で定義しています。

| 名前 | カラーコード | 用途 |
|---|---|---|
| brand | `#2D5246` | メインカラー（ボタン・リンク等） |
| sage | `#D1E4DD` | 枠線・番号アイコン背景（テーブルヘッダー背景は `bg-[#D1E4DD]` で直接指定） |
| soft | `#F2F8F5` | ページ・カード背景 |
| ink | `#1E2820` | 本文テキスト |
| theme-color | `#1B6B6B` | ブラウザUIカラー（`<meta name="theme-color">`） |

## assets/

| ファイル | 内容 |
|---|---|
| tailwind-input.css | カスタムスタイルの元ファイル（フォントサイズ・行間・表・外部リンクアイコン等） |
| tailwind.css | 上記からのビルド成果物（自動生成） |
| site.js | ヒーローパララックス・モバイルメニュー・年表示 |
| contact.js | お問い合わせフォームの送信処理（GASへPOST。Turnstileのトークンが無い場合は送信を止める） |
| logotype.svg | ヘッダー・フッターのロゴタイプ |
| logo-03-2.svg | ロゴ（sakasaew.html で使用） |
| symbol1.svg / symbol2.svg | ヘッダーのロゴマーク等のシンボル |
| yamamura-square.png | ロゴマーク（正方形）・ファビコン用 |
| main-visual.png / main-visual-tall.jpg | ヒーロー背景画像（PC用 / 縦長用） |
| lulu_silhouette.svg / reli_silhouette.svg | シルエット素材（現在どのページからも未使用） |
| hero-reference.png | ヒーロー作成時の参考画像（サイトでは未使用） |

## その他のルートファイル

| ファイル | 内容 |
|---|---|
| `_redirects` | `.html` 付き・スラッシュ付きURLを、スラッシュなしURLへ301リダイレクト |
| `_headers` | Cloudflare Pagesのレスポンスヘッダー設定（CSP等のセキュリティヘッダー）。外部サービスを追加したら CSP の許可先も更新すること（Turnstile 用に `challenges.cloudflare.com` を許可済み）。`sakasaew.html` のインラインscriptはハッシュで許可しているので、書き換えたらsha256を再計算する |
| `sitemap.xml` / `robots.txt` | SEO用 |
| `ee88badadad046fbabb176444dd610df.txt` | 検索エンジン向けのキー確認ファイル（IndexNow形式）。削除しないこと |
