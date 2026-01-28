# 就活締切管理アプリ (dhukatu)

就活生向けES・選考締切一覧サイト。複数の情報発信源からデータを統合し、カレンダービューで締切管理を支援します。

## 🚀 技術スタック

- **フロントエンド**: Next.js 14 (App Router)
- **デプロイ**: Vercel
- **データソース**: X API v2
- **カレンダー**: FullCalendar
- **バックエンド/DB**: Convex
- **スタイリング**: Tailwind CSS

## 📁 プロジェクト構成

```
/
├── app/
│   ├── page.tsx              # トップページ（一覧）
│   ├── calendar/page.tsx     # カレンダービュー
│   ├── company/[id]/page.tsx # 企業詳細
│   ├── api/
│   │   ├── scrape/           # スクレイピングAPI
│   │   ├── companies/        # 企業一覧API
│   │   └── calendar/         # カレンダーAPI
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── CompanyCard.tsx       # 企業カード
│   └── FilterPanel.tsx       # 絞り込みパネル
├── convex/
│   ├── schema.ts             # DBスキーマ定義
│   └── functions.ts          # Convex関数
├── lib/
│   ├── types.ts              # 共通型定義
│   ├── parser.ts             # 投稿解析ロジック
│   └── x-api.ts              # X APIクライアント
└── package.json
```

## 🛠️ セットアップ

### 1. 環境変数の設定

`.env.local` ファイルを作成し、以下の環境変数を設定します：

```bash
# X API Configuration
X_BEARER_TOKEN=your_bearer_token_here

# Convex Configuration
NEXT_PUBLIC_CONVEX_URL=
CONVEX_DEPLOYMENT=

# Target X Accounts
TARGET_X_ACCOUNTS=syukatsurisu,InternGuide,gaishishukatsu
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. Convex のセットアップ

```bash
npx convex dev
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 にアクセスしてください。

## 📊 データソース

| ソース | 種別 | 内容 |
|--------|------|------|
| @syukatsurisu | Xアカウント | 就活リス - ES・選考締切メイン |
| @InternGuide | Xアカウント | インターンシップガイド公式 |
| @gaishishukatsu | Xアカウント | 外資就活ドットコム |
| 就活市場 | Webサイト | 締切カレンダー |
| ラク就活 | Webサイト | ES締切一覧 |

## 🗄️ Convex スキーマ

### companies テーブル
```typescript
{
  name: string,
  industry: string,
  website: string,
  logo_url: string,
  description: string,
  locations: string[],
  created_at: number
}
```

### deadlines テーブル
```typescript
{
  company_id: string,
  company_name: string,
  type: "es" | "honsenkou" | "test_center" | "internship",
  deadline_date: string,
  description: string,
  link: string,
  source: string,
  created_at: number
}
```

### test_centers テーブル
```typescript
{
  company_id: string,
  company_name: string,
  type: "web" | "venue",
  location: string,
  notes: string,
  created_at: number
}
```

## 📝 スクリプト

| コマンド | 説明 |
|----------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | プロダクションビルド |
| `npm run start` | プロダクションサーバー起動 |
| `npm run lint` | ESLint 実行 |

## 🔧 API エンドポイント

### `GET /api/companies`
企業一覧を取得

### `GET /api/calendar`
カレンダー用の締切データを取得

### `POST /api/scrape`
X API からデータを収集してデータベースに保存

## ✅ 次のステップ

1. X API Bearer Token の取得
   - https://developer.twitter.com/en/portal/dashboard

2. Convex プロダクション環境の設定

3. Vercel へのデプロイ

4. 定期スクレイピングの設定（Cron Jobs）

## 📄 ライセンス

ISC
