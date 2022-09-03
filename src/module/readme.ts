import {appendFile} from 'fs/promises';
import {WriteFile} from '../utility/fileIO';

export async function WriteBasicReadme(pat: string) {
  await WriteFile(pat, def_msg.replace(new RegExp('"', 'g'), ''));
}
export async function InsertReadme(pat: string, str: string) {
  await appendFile(pat, str);
}
const def_msg = `
# movie-tv-generater

A tool to fetch movie or series list form TMDB to generate folder for better managing media files.

一個自動獲取動漫新資訊的工具，每天從TMDB獲取符合標籤的資訊，製作成檔案及資料夾，並配合影院軟體（例如：Emby ）做方便的統合檔案管理。

by tool

`;
