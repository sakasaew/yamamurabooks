# 山村書店サイト — プロジェクト情報

## ホスティング・デプロイ
- **Cloudflare Pages**（GitHubリポジトリ `sakasaew/yamamurabooks` と自動連携）
- `git push origin main` → Cloudflare Pagesが自動デプロイ
- GitHub Pagesも設定されているが、本番はCloudflare Pages
- `netlify.toml` はCloudflare Pagesでは**無効**（Netlify専用ファイルなので触れないこと）

## 本番URL
https://www.yamamurabook.shop/

## プッシュ先ルール（重要）
- **原則として、作業ブランチ（`main` 以外）にプッシュしてプレビューで確認する**
  - 作業ブランチ `xxx` にプッシュ → プレビュー `https://xxx.yamamurabooks.pages.dev` に反映（本番には出ない）
  - 例：`add-textbook-page` → https://add-textbook-page.yamamurabooks.pages.dev
- **`main` へのプッシュ・マージは本番に反映されるため、ユーザーの明示的な指示があるときだけ行う**
- プッシュする前に、**どのブランチにプッシュし、どこ（プレビュー／本番）に反映されるか**を必ずユーザーに伝える

## 技術スタック
- 静的HTML + Tailwind CSS（ローカルビルド）
- Tailwind CLI: `./tailwindcss.exe -i ./assets/tailwind-input.css -o ./assets/tailwind.css --minify`
- カスタムスタイルは `assets/tailwind-input.css` に記載（`tailwind.css` は自動生成なので直接編集しない）
- Google Fonts: Noto Sans JP（同期読み込み・display=swap）

## ページ一覧
| ファイル | URL |
|---|---|
| index.html | / |
| news.html | /news |
| access.html | /access |
| company.html | /company |
| recruit.html | /recruit |
| faq.html | /faq |
| contact.html | /contact |
| sakasaew.html | /sakasaew |
| privacypolicy.html | /privacypolicy |
| tokushoho.html | /tokushoho |

## URL設計ルール（重要）
- canonical・sitemap・`_redirects` はすべて**スラッシュなし**で統一
- `.html` 拡張子付きURLは `_redirects` で301リダイレクト済み
- スラッシュあり（`/foo/`）→ スラッシュなし（`/foo`）も `_redirects` で明示済み
- **新しいページを追加するときは `_redirects` と `sitemap.xml` も必ず更新する**

## 作業ルール
- **Claude操作はVSCode経由に統一**（デスクトップアプリ・Dispatch等からの作業はしない）
- 別セッションで変更された形跡があれば、まず `git log` で確認してから作業する
- `tailwind.css` は自動生成ファイルなので直接編集しない。スタイル変更は `assets/tailwind-input.css` に書いてTailwind CLIでビルドする

## 教科書ページ（PR #5 / `add-textbook-page`）の公開予定（重要）
- `textbook.html` と学年ページ（`textbook/r9/{ikeda,daiko}-{1,2,3}.html`）は、**令和9年度のデータが出てから**（来年2月ごろ）本番に公開する。**それまで PR #5 を `main` にマージしない**（ユーザーの明示的な指示があるときだけ）
- `add-textbook-page` を `main` にマージすると、このブランチの内容が**すべて**本番に出る（教科書ページに加えて、新FAQ・電話番号の削除・見た目の変更も含む）
- 新しいFAQ（令和9年度の支払い方法の内容を含む）は、公開まで本番に反映しない。FAQ以外の見た目・文言の変更を先に本番へ出すときは、`main` から別ブランチを切って分ける
- `main` で他の変更（#10〜#14 など）が入ったら、ユーザーの指示で `main` をこのブランチに**マージ**で取り込む（rebase はしない）。取り込んだあとは Tailwind を再ビルドする

### 公開前の作業メモ
- 学年ページの金額データは `textbook/r9/data/prices.json`（JSON を差し替えるだけで金額が変わる。表示コードは共通の `textbook/r9/grade.js`、各ページの学校・学年・お支払い開始日・文言は同名の `textbook/r9/ikeda-1.js` などの `window.TEXTBOOK_PAGE`）。正式な定価（3/1ごろ）が出たら JSON を差し替え、合計欄の「見本の金額は、令和9年度の予定価などによる概算です。」の注記（`grade.js`）を外す。この JSON は Web 用（社内用の項目 no・source・memo・fee_note・設定は入っていない）。社内用の「R9_金額データ.json」はリポジトリに入れない（URL を知っていれば誰でも読めるため）。後日販売（合計金額に含まれない）は JSON の `later_sales` から表示する。**学年ページのscriptは、`_headers` のCSP（`script-src 'self'`）でインラインscriptが動かないため、HTMLの外の `.js` ファイルにしてある。HTMLに直接 `<script>` を書き戻さないこと**
- `textbook.html` と `faq.html` のFAQ「教科書の情報を知りたい」にある「※令和8年の情報です。」と、文部科学省ページのURLを更新する
- 販売開始時期（前期4月16日以降、後期9月16日以降 など）の年度表記と日付を、令和9年度のものに更新する（ソースの「来年のタスク」コメントが目印。教科書ページとFAQの両方）
- 学年ページは検索結果に出さない設定（noindex）で、`sitemap.xml` にも載せていない。公開時にこの扱いを変えるかはユーザーに確認する
- 学年ページの `ikeda-1` は、学科・選択内容が1つだけ（JSON の label は「全員共通」）のため、`grade.js` が選択欄を自動で隠す。label は画面に出ないが、そのままでよい（ユーザー確認済み）

### 教科書関連ページのURL一覧（プレビュー：`add-textbook-page` の状態）
プレビューのベースURL: `https://add-textbook-page.yamamurabooks.pages.dev`（公開後は `https://www.yamamurabook.shop` に置き換わる）

| ページ | ファイル | URL（ベースURLのあと） |
|---|---|---|
| 教科書のご案内（メイン） | `textbook.html` | `/textbook` |
| 池田高校 新1年生 | `textbook/r9/ikeda-1.html` | `/textbook/r9/ikeda-1` |
| 池田高校 新2年生 | `textbook/r9/ikeda-2.html` | `/textbook/r9/ikeda-2` |
| 池田高校 新3年生 | `textbook/r9/ikeda-3.html` | `/textbook/r9/ikeda-3` |
| 大垣工業高校 新1年生 | `textbook/r9/daiko-1.html` | `/textbook/r9/daiko-1` |
| 大垣工業高校 新2年生 | `textbook/r9/daiko-2.html` | `/textbook/r9/daiko-2` |
| 大垣工業高校 新3年生 | `textbook/r9/daiko-3.html` | `/textbook/r9/daiko-3` |

- 学年ページ6枚は `noindex`（検索結果に出さない）で、`sitemap.xml` にも載せていない。メインの `/textbook` は `sitemap.xml` と `_redirects` に登録済み
- 「新○年生」は令和9年度の学年（ファイル名の `r9` が令和9年度）

### 特商法ページ（`tokushoho.html`）の教科書部分の扱い（重要）
- 特商法ページは #15 で本番に出た。そのうち「学校を通じた新学期の教科書の販売」の記載（お支払い方法・お支払い時期・商品の引渡し時期）は、令和9年度の運用（払込票・コンビニ・スマホ決済）と、まだ公開されていない各学年のご案内を前提にしているため、#16 で**本番側からは外してある**（冒頭の文章・送料・お支払い手数料などは本番にも残っている）
- **このブランチ（PR #5）では、外した記載を元に戻してある**（教科書キャッシュレスに関する記載ありの版。冒頭の文章は #16 と同じ「…に分けて記載しています。」の版）。PR #5 を `main` にマージすると、この記載が本番に出る。元の全文は、コミット `7750411` と #15 のコミット `1438b5c` にも残っている（`git show 1438b5c:tokushoho.html`）
- `main` の特商法ページを変更したら、このブランチに取り込むときに、教科書の記載を消さないように確認する

### 特商法ページ（`tokushoho.html`）のログ（2026-11-17 オーナーより共有）
- 特商法の表記は、どこかに届け出るものではなく、弁護士の確認も法的には必要ない。サイトに載せておけば義務を果たしたことになる。確認が必要なのは、載せた内容が実際の運用と合っているかどうかだけ。
- 手数料まわりの文面（「販売手数料（決済手数料等）・送料」「手数料について」：決済手数料は販売手数料に含まれ、銀行振込の振込手数料はお客さまの負担）は、オーナー確認済み（プレビュー `2450bbd`）。
- 電話番号・メールアドレス・「お問い合わせフォーム・メール・LINEにて承ります」は記載済み。電話の受付時間は未記載（追加するかは保留）。
