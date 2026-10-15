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
- 学年ページの金額データ（`<script>` 内の `DATA`）を、令和8年のダミーから令和9年のものに差し替える
- 学年ページ上部の「ダミー（試作）：令和8年度のデータ・定価で表示しています」を消す
- `textbook.html` と `faq.html` のFAQ「教科書の情報を知りたい」にある「※令和8年の情報です。」と、文部科学省ページのURLを更新する
- 販売開始時期（前期4月16日以降、後期9月16日以降 など）の年度表記と日付を、令和9年度のものに更新する（ソースの「来年のタスク」コメントが目印。教科書ページとFAQの両方）
- 学年ページは検索結果に出さない設定（noindex）で、`sitemap.xml` にも載せていない。公開時にこの扱いを変えるかはユーザーに確認する
- 学年ページの `ikeda-1` は、コースが1つだけのため選択欄を隠している（`"single": true`）。コース説明は画面に出ないが、そのままでよい（ユーザー確認済み）

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
- 特商法ページは #15 で本番に出ているが、「学校を通じた新学期の教科書の販売」の記載は、令和9年度の運用（払込票・コンビニ・スマホ決済）と、まだ公開されていない各学年のご案内を前提にしているため、**本番側では一時的に外す方針**（ユーザーが本番側で作業する。冒頭の文章・送料・お支払い手数料は残す）
- **外した記載は、この PR #5 の公開時に戻す。** 元の全文（教科書キャッシュレスに関する記載ありの特商法ページ）は、このブランチの `tokushoho.html`（現状のまま保管。コミット `7750411`）と、#15 のコミット `1438b5c` に残っている（`git show 1438b5c:tokushoho.html`）。戻す対象は「販売価格」以降の項目のうち、「学校を通じた新学期の教科書の販売」として載っていたもの（販売価格・お支払い方法・お支払い時期・商品の引渡し時期など）
- `main` の取り込み時に、外した記載がこのブランチの `tokushoho.html` からも消える場合は、公開前に上記のコミットから戻すこと
