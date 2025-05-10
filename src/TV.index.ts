import './extension/console';
import {rm} from 'node:fs/promises';
import {join} from 'node:path';
import {MKDir, WriteFile} from './utility/fileIO';
import {DiscoverTV} from './wraptmdb/func.discoverTVs';
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
    await rm(join('output'), {recursive: true, force: true})
      .catch(err => {
        console.error(err);
      })
      .finally(async () => {
        await MKDir(join('output'));
      });

    //拉取電影及影集資料後儲存Cache
    const cacheTV = await DiscoverTV(discoverTagID, TOKEN);
    await WriteFile(
      join(join('output'), 'tvserie', 'cacheTV.json'),
      JSON.stringify(cacheTV, null, 4),
    );
    await WriteFile(
      join('./data', 'tvserie', 'cacheTV.json'),
      JSON.stringify(cacheTV, null, 4),
    );
    //
    const html = RenderHTML(cacheTV, []);
    await WriteFile(join('index.html'), html);
  } catch (error) {
    console.error(error);
  }
})().finally(() => {
  console.log('--流程結束--');
});
