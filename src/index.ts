import {rm} from 'node:fs/promises';
import {join} from 'node:path';
import RenderHTML from './html';
import {MKDir, WriteFile} from './utility/fileIO';

const core = require('@actions/core');
const notAction = process.env['isAction'] ? process.env['isAction'] : true;
const TOKEN =
  process.env.TMDB_TOKEN === undefined || process.env.TMDB_TOKEN === ''
    ? process.argv[2]
    : process.env.TMDB_TOKEN;
//Setup wrapTMDB
//
async function main() {
  //每次啟動時清除並重建 /output
  const outputPath = join(__dirname, '../', '../', 'output');
  if (!notAction)
    await rm(outputPath, {recursive: true}).catch(err => {
      console.error(err);
    });
  await MKDir(outputPath);

  //
  //TV Shows
  const cacheTV = await DiscoverTV(['210024'], './output/tvshows/', TOKEN); //anime: 210024
  //Movies
  const cachemov = await DiscoverMovie(['210024'], './output/movie/', TOKEN);
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
