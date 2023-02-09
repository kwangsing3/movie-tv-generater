import {rm} from 'node:fs/promises';
import {join} from 'node:path';
import * as wrapTMDB from 'wraptmdb-ts';
import RenderHTML from './html';
import getMovies from './Movies.func';
import getTVshows from './TVshows.func';
import {MKDir, WriteFile} from './utility/fileIO';
import {SetRatePerMin, sleep} from './utility/httpmethod';

const core = require('@actions/core');
const notAction = process.env['isAction'] ? process.env['isAction'] : true;
const TOKEN =
  process.env.TMDB_TOKEN === undefined || process.env.TMDB_TOKEN === ''
    ? process.argv[2]
    : process.env.TMDB_TOKEN;
//Setup wrapTMDB
wrapTMDB.Init(TOKEN);
wrapTMDB.SetHeader({
  'User-Agent': 'Movie-TV-Generater: Daily Update',
  Referer: 'https://github.com/kwangsing3/movie-tv-generater',
});
//
async function main() {
  //每次啟動時清除並重建 /output
  const outputPath = join(__dirname, '../', '../', 'output');
  if (!notAction)
    await rm(outputPath, {recursive: true}).catch(err => {
      console.error(err);
    });
  await MKDir(outputPath);
  SetRatePerMin(60);

  //README
  const READpat = join(__dirname, '../', '../', 'README.md');
  //
  //TV Shows
  const cacheTV = await getTVshows(['210024'], './output/tvshows/'); //anime: 210024
  //Movies
  const cachemov = await getMovies(['210024'], './output/movie/');
  const html = RenderHTML(cacheTV, cachemov);
  const pp = await WriteFile(join(__dirname, '../', '../', 'index.html'), html);
  console.log(pp);
}
//
try {
  main();
} catch (error) {
  if (notAction) {
    core.setFailed(`${error}`);
  } else {
    console.error(error);
  }
}

/*

  TODO:
  1. 製作以環境變數決定的 假資料以免每次測試都要拉很多資料。


*/
