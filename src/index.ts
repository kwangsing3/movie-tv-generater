import './extension/console';
import {rm} from 'node:fs/promises';
import {join} from 'node:path';
import RenderHTML from './HTML/html.func';
import {MKDir, WriteFile} from './utility/fileIO';
import {DiscoverTV} from './wraptmdb/tv.func';
import {DiscoverMovie} from './wraptmdb/movie.func';
import cacheTV from './test/cacheTV.json';
import cacheMOVIE from './test/cacheMOVIE.json';

//Setup wrapTMDB
const TOKEN = process.env.TMDB_TOKEN ?? process.argv[2];
const discoverTagID = ['210024']; //anime: 210024

(async () => {
  console.log('--流程開始--');
  try {
    if (process.env['MODE'] === 'DEBUG') await sandbox();
    //每次啟動時清除並重建 /output
    const outputPath = join('output');
    await rm(outputPath, {recursive: true, force: true}).catch(err => {
      console.error(err);
    });
    await MKDir(outputPath);

    //拉取電影及影集資料後儲存Cache
    const cacheTV = await DiscoverTV(discoverTagID, TOKEN);
    const cachemov = await DiscoverMovie(discoverTagID, TOKEN);
    await WriteFile(
      join(outputPath, 'tvserie', 'cacheTV.json'),
      JSON.stringify(cacheTV, null, 4),
    );
    await WriteFile(
      join(outputPath, 'movie', 'cachemov.json'),
      JSON.stringify(cachemov, null, 4),
    );
    //
    const html = RenderHTML(cacheTV, cachemov);
    await WriteFile(join('index.html'), html);
    //
  } catch (error) {
    console.error(error);
  }
})().finally(() => {
  console.log('--流程結束--');
});

async function sandbox() {
  const html = RenderHTML(cacheTV, cacheMOVIE);
  await WriteFile(join('index.html'), html);
  throw 'Early out';
}
