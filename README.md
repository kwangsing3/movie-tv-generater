# movie-tv-generater

透過 **TMDB API** 自動抓取動漫 / 電影 / 影集資訊，並在本地生成對應的資料夾結構，搭配媒體管理軟體（如 Emby、Jellyfin）使用，讓媒體庫自動整齊歸檔。

支援以 **GitHub Actions** 排程定期執行，實現全自動更新。

## 功能

- 從 TMDB Discover API 依標籤 ID 批次拉取動漫 / 電影 / 影集清單
- 自動建立 `/output` 資料夾並依名稱分類生成子資料夾
- 同步生成 HTML 預覽頁面（`/output/index.html`）
- 支援電影（Movie）與影集（TV）兩條獨立流程
- 進度條顯示抓取狀態（cli-progress）

## 技術棧

| 層級 | 套件 |
|------|------|
| 語言 | TypeScript 5 |
| HTTP | axios |
| TMDB 整合 | 自製 wraptmdb 封裝層 |
| CI/CD | GitHub Actions (`@actions/core`) |
| 開發工具 | nodemon + gts + husky |

## 快速開始

### 安裝依賴

```bash
npm install
```

### 設定 TMDB Token

取得 TMDB API Read Access Token（Bearer token）：
- 前往 [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)

設定方式（二選一）：

```bash
# 環境變數（推薦）
export TMDB_TOKEN=your_token_here

# 或直接作為命令列引數
node build/src/index.js your_token_here
```

### 執行

```bash
# 開發模式（熱重載）
npm start

# 生產模式
npm run build
npm run prod
```

執行後在 `./output/` 查看生成的資料夾與 HTML 預覽。

## 修改抓取標籤

編輯 `src/Movie.index.ts` 或 `src/TV.index.ts` 中的 `discoverTagID`：

```typescript
const discoverTagID = ['210024']; // 210024 = 動漫（anime）
```

TMDB 標籤 ID 可至 [TMDB Keyword 搜尋](https://www.themoviedb.org/keyword) 查詢。

## 與 Emby / Jellyfin 整合

將 `./output/` 路徑掛載為媒體庫來源，媒體軟體會自動掃描並匹配元資料。

## 授權

ISC