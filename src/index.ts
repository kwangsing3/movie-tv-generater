const core = require('@actions/core');
import {rm, rmdir} from 'node:fs/promises';
import {join} from 'node:path';
import * as wrapTMDB from 'wraptmdb-ts';
import getMovies from './module/Movies.func';
import getTVshows from './module/TVshows.func';
import {InsertReadme, WriteBasicReadme} from './module/readme';
import {WriteStruct} from './module/struct';
import {MKDir} from './utility/fileIO';
const isAction = false;
const TOKEN =
  process.env.TMDB_TOKEN === undefined || process.env.TMDB_TOKEN === ''
    ? process.argv[2]
    : process.env.TMDB_TOKEN;
//
//
//Setup wrapTMDB
wrapTMDB.Init(TOKEN);
wrapTMDB.SetHeader({
  'User-Agent': 'Movie-TV-Generater: Daily Update',
  Referer: 'https://github.com/kwangsing3/movie-tv-generater',
});
//
async function main() {
  //
  //每次啟動時清除並重建/output
  const outputPath = join(__dirname, '../', '../', 'output');
  await rm(outputPath, {recursive: true}).catch(err => {
    console.error(err);
  });
  await MKDir(outputPath);

  //
  //README
  const ReaDpat = join(__dirname, '../', '../', 'README.md');
  await WriteBasicReadme(ReaDpat);
  //
  //
  //TV Shows
  await getTVshows(['210024'], './output/tvshows/'); //anime: 210024
  const tvst = await WriteStruct('tv', outputPath);
  await InsertReadme(ReaDpat, tvst!);

  //Movies
  await getMovies(['210024'], './output/movie/');
  const mvst = await WriteStruct('movie', outputPath);
  await InsertReadme(ReaDpat, mvst!);
}
//
//
//
try {
  main();
} catch (error) {
  if (isAction) {
    core.setFailed(`${error}`);
  } else {
    console.error(error);
  }
}

/*

  TODO:
  1. 製作以環境變數決定的 假資料以免每次測試都要拉很多資料。


*/
