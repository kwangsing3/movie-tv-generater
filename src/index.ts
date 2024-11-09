import {rm} from 'node:fs/promises';
import {join} from 'node:path';
import RenderHTML from './html';
import {MKDir, WriteFile} from './utility/fileIO';
import {DiscoverTV} from './wraptmdb/tv.func';
import {DiscoverMovie} from './wraptmdb/movie.func';

//Setup wrapTMDB
const TOKEN = process.env.TMDB_TOKEN ?? process.argv[2];
const discoverTagID = ['210024']; //anime: 210024

(async () => {
  console.log('--流程開始--');
  try {
    await sandbox();
    //每次啟動時清除並重建 /output
    const outputPath = join('output');
    await rm(outputPath, {recursive: true, force: true}).catch(err => {
      console.error(err);
    });
    await MKDir(outputPath);

    //TV Shows
    const cacheTV = await DiscoverTV(discoverTagID, './output/tvshows/', TOKEN);
    //Movies
    const cachemov = await DiscoverMovie(
      discoverTagID,
      './output/movie/',
      TOKEN,
    );

    //
    const html = RenderHTML(cacheTV, cachemov);
    await WriteFile(join(__dirname, '../', '../', 'index.html'), html);
    //
  } catch (error) {
    console.error(error);
  }
})().finally(() => {
  console.log('--流程結束--');
});

async function sandbox() {
  //
  await DiscoverMovie(discoverTagID, './output/movie/', TOKEN);
}
/*

  TODO:
  1. 製作以環境變數決定的 假資料以免每次測試都要拉很多資料。


*/
