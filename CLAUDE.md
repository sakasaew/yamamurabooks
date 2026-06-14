# 山村書店サイト — プロジェクト情報

## ホスティング・デプロイ
- **Cloudflare Pages**（GitHubリポジトリ `sakasaew/yamamurabooks` と自動連携）
- `git push origin main` → Cloudflare Pagesが自動デプロイ
- GitHub Pagesも設定されているが、本番はCloudflare Pages
- `netlify.toml` はCloudflare Pagesでは**無効**（Netlify専用ファイルなので触れないこと）

## 本番URL
https://www.yamamurabook.shop/

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

## URL設計ルール（重要）
- canonical・sitemap・`_redirects` はすべて**スラッシュなし**で統一
- `.html` 拡張子付きURLは `_redirects` で301リダイレクト済み
- スラッシュあり（`/foo/`）→ スラッシュなし（`/foo`）も `_redirects` で明示済み
- **新しいページを追加するときは `_redirects` と `sitemap.xml` も必ず更新する**

## 作業ルール
- **Claude操作はVSCode経由に統一**（デスクトップアプリ・Dispatch等からの作業はしない）
- 別セッションで変更された形跡があれば、まず `git log` で確認してから作業する
- `tailwind.css` は自動生成ファイルなので直接編集しない。スタイル変更は `assets/tailwind-input.css` に書いてTailwind CLIでビルドする
