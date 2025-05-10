import {GET, Sleep} from '../utility/http.mod';
import {DiscoverResponse, ITVseries} from '../int.basic';
import * as cliProgress from 'cli-progress';
//Step1
export async function DiscoverTV(
  keywords: string[],
  TOKEN: string,
): Promise<ITVseries[]> {
  let CACHE: ITVseries[] = [];
  let cur_page = 1;
  let MaxPage = 1;
  //First request to get infomation
  const url =
    'https://api.themoviedb.org/3/discover/tv?include_adult=true&include_null_first_air_dates=false&language=zh-tw&sort_by=popularity.desc&with_keywords=' +
    keywords.toString().replace(/,/g, '');
  const headers = {
    accept: 'application/json',
    Authorization: 'Bearer ' + TOKEN,
  };
  const response = await GET(url + `&page=${cur_page++}`, headers);
  const data: DiscoverResponse = response.data as DiscoverResponse;
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
      const response = await GET(url + `&page=${cur_page}`, headers);
      const data: DiscoverResponse = response.data as DiscoverResponse;
      if (data?.['results'].length === 0) {
        continue;
      }
      const resList: ITVseries[] = data['results'] as ITVseries[];
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
