import * as console from './extension/console';
require('dotenv').config(); // .env
import {rm} from 'node:fs/promises';
import {join} from 'node:path';
import * as wrapTMDB from 'wraptmdb-ts';
import RenderHTML from './html/html';
import getMovies from './Movies.func';
import getTVshows from './TVshows.func';
import {MKDir, WriteFile} from './utility/fileIO';

const notAction = process.env['isAction'] ? process.env['isAction'] : true;
const TOKEN = process.env['TMDB_TOKEN'];

if (!notAction) {
  //Github Action
  process.env['STATICFILE'] = 'false';
  process.env['CACHE'] = 'true';
}

//Print Enviroment
console.log(`
Print Enviroment:
  MODE=${process.env['MODE']}
  STATICFILE=${process.env['STATICFILE']}
  CACHE=${process.env['CACHE']}
`);

//Setup wrapTMDB
wrapTMDB.Init(TOKEN);
wrapTMDB.SetHeader({
  'User-Agent': 'Movie-TV-Generater: Daily Update',
  Referer: 'https://github.com/kwangsing3/movie-tv-generater',
});

async function main() {
  //每次啟動時清除並重建 /output
  if (TOKEN === undefined) return;
  const outputPath = join(__dirname, '../', '../', 'output');
  if (notAction)
    await rm(outputPath, {recursive: true}).catch(err => {
      console.error(err); //避免沒有資料夾導致刪除拋錯
    });
  await MKDir(outputPath);
  //TV Shows
  const cacheTV = await getTVshows(['210024']); //anime: 210024
  //Movies
  const cachemov = await getMovies(['210024']);

  const html = RenderHTML(cacheTV, cachemov);
  // Write HTML file
  await WriteFile(join(__dirname, '../', '../', 'index.html'), html);
}

main().catch((error: unknown) => {
  console.error(error);
});
