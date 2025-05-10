import {GET, Sleep} from '../utility/http.mod';
import {DiscoverResponse, ITVseries} from '../int.basic';
import * as cliProgress from 'cli-progress';
import {ReadFile} from '../utility/fileIO';
import {join} from 'path';
//Step1
export async function DiscoverTV(
  keywords: string[],
  TOKEN: string,
): Promise<ITVseries[]> {
  if (process.env['CACHE'] === 'true') {
    try {
      const TVs = JSON.parse(
        await ReadFile(join('./data', 'tvserie', 'cacheTV.json')),
      ) as ITVseries[];
      return TVs;
    } catch (error) {
      console.log('無法讀取快取檔案，將重新獲取資料');
    }
  }
  let CACHE: ITVseries[] = [];
  let cur_page = 1;
  let MaxPage = 1;
  //First request to get infomation
  const _URL = new URL('https://api.themoviedb.org/3/discover/tv');
  _URL.searchParams.append('include_adult', 'true');
  _URL.searchParams.append('include_null_first_air_dates', 'false');
  _URL.searchParams.append('language', 'zh-TW');
  _URL.searchParams.append('sort_by', 'popularity.desc');
  _URL.searchParams.append('with_keywords', keywords.toString());

  const headers = {
    accept: 'application/json',
    Authorization: 'Bearer ' + TOKEN,
  };
  const response = await GET(_URL + `&page=${cur_page++}`, headers);
  const data: DiscoverResponse = response.data as DiscoverResponse;
  console.log('獲取影集資訊列表...');
  MaxPage = data['total_pages'] > 1 ? data['total_pages'] : -1;

  //進度條
  const Mainbar = new cliProgress.SingleBar(
    {
      format: '影集資訊獲取進度: [{bar}] {percentage}% |  {value}/{total}',
    },
    cliProgress.Presets.shades_classic,
  );
  Mainbar.start(data.total_results, 0);
  let barCounter = 0;
  //
  while (cur_page <= MaxPage) {
    //更新搜尋屬性
    await Sleep(200);
    try {
      console.log(`獲取第 ${cur_page}/${MaxPage} 頁影集資訊---`);
      const response = await GET(_URL + `&page=${cur_page}`, headers);
      const data: DiscoverResponse = response.data as DiscoverResponse;
      if (data?.['results'].length === 0) {
        continue;
      }
      let resList: ITVseries[] = data['results'] as ITVseries[];
      resList = resList.filter(e => !isNaN(Date.parse(e.first_air_date))); //過濾掉為空或無法顯示的日期
      resList.forEach(e => {
        Mainbar.update(++barCounter);
        e.poster_path = `https://image.tmdb.org/t/p/w500${e['poster_path']}`;
      });
      CACHE = [...CACHE, ...resList];
      cur_page++;
    } catch (error) {
      Mainbar.stop();
      break;
    }
    if (process.env['MODE'] === 'DEBUG') break;
  }
  Mainbar.update(data.total_results);
  Mainbar.stop();
  return CACHE;
}
