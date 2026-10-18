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
- お問い合わせフォーム：Google Apps Script（`assets/contact.js` から送信。送信先コードはこのリポジトリには含まれない）
- ホスティング：Cloudflare Pages（`main` への push で自動デプロイ）

## CSSのビルド

スタイルは `assets/tailwind-input.css` に書き、ビルドして `assets/tailwind.css` を生成します。`tailwind.css` は自動生成ファイルなので直接編集しません。

```
npm run build:css      # 1回ビルド
npm run watch:css      # 監視ビルド
```

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
| contact.js | お問い合わせフォームの送信処理（GASへPOST） |
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
| `_headers` | Cloudflare Pagesのレスポンスヘッダー設定（CSP等のセキュリティヘッダー）。外部サービスを追加したら CSP の許可先も更新すること。`sakasaew.html` のインラインscriptはハッシュで許可しているので、書き換えたらsha256を再計算する |
| `sitemap.xml` / `robots.txt` | SEO用 |
| `ee88badadad046fbabb176444dd610df.txt` | 検索エンジン向けのキー確認ファイル（IndexNow形式）。削除しないこと |
