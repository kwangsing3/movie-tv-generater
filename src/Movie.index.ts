import './extension/console';
import {rm} from 'node:fs/promises';
import {join} from 'node:path';
import {MKDir, WriteFile} from './utility/fileIO';
import {DiscoverMovie} from './wraptmdb/func.discoverMovie';
import sandbox from './sandbox';
import RenderHTML from './HTML/func.genhtml';

//Setup wrapTMDB
const TOKEN = process.env.TMDB_TOKEN ?? process.argv[2];
const discoverTagID = ['210024']; //anime: 210024

(async () => {
  console.log('--流程開始--');
  try {
    await sandbox();
    //每次啟動時清除並重建 /output
    await rm('./output', {recursive: true, force: true})
      .catch(err => {
        console.error(err);
      })
      .finally(async () => {
        await MKDir('./output');
      });

    //拉取電影資料後儲存Cache
    const cachemov = await DiscoverMovie(discoverTagID, TOKEN);
    await WriteFile(
      join('./output', 'movie', 'cachemov.json'),
      JSON.stringify(cachemov, null, 4),
    );
    await WriteFile(
      join('./data', 'movie', 'cachemovie.json'),
      JSON.stringify(cachemov, null, 4),
    );
    //生成頁面
    const html = RenderHTML([], cachemov);
    await WriteFile(join('index.html'), html);
    //
  } catch (error) {
    console.error(error);
  }
})().finally(() => {
  console.log('--流程結束--');
});
