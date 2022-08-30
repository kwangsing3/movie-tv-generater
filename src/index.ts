const core = require('@actions/core');
import {rmdir} from 'node:fs/promises';
import {join} from 'node:path';
import * as wrapTMDB from 'wraptmdb-ts';
import getMovies from './module/getMovies';
import getTVshows from './module/getTVshows';
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
//
//
//
async function main() {
  //
  //每次啟動時清除並重建/output
  const outputPath = join(__dirname, '../', '../', 'output');
  await rmdir(outputPath).catch(() => {});
  await MKDir(outputPath);
  //
  //
  //TV Shows
  await getTVshows(['210024'], './output/tvshows/'); //anime: 210024
  //Movies
  await getMovies(['210024'], './output/movie/');
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
