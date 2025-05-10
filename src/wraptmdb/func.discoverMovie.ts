import {GET, Sleep} from '../utility/http.mod';
import {DiscoverResponse, IMovie} from '../int.basic';
import * as cliProgress from 'cli-progress';
import {ReadFile} from '../utility/fileIO';
import {join} from 'path';
//Step1
export async function DiscoverMovie(
  keywords: string[],
  TOKEN: string,
): Promise<IMovie[]> {
  if (process.env['CACHE'] === 'true') {
    try {
      const movie = JSON.parse(
        await ReadFile(join('./data', 'movie', 'cachemovie.json')),
      ) as IMovie[];
      return movie;
    } catch (error) {
      console.log('無法讀取快取檔案，將重新獲取資料');
    }
  }

  let CACHE: IMovie[] = [];
  let cur_page = 1;
  let MaxPage = 1;
  const _URL = new URL('https://api.themoviedb.org/3/discover/movie');
  _URL.searchParams.append('include_adult', 'true');
  _URL.searchParams.append('language', 'zh-TW');
  _URL.searchParams.append('sort_by', 'popularity.desc');
  _URL.searchParams.append('with_keywords', keywords.toString());
  //
  const headers = {
    accept: 'application/json',
    Authorization: 'Bearer ' + TOKEN,
  };
  //First request to get infomation
  const response = await GET(_URL + `&page=${cur_page++}`, headers);
  const data: DiscoverResponse = response.data as DiscoverResponse;
  console.log('獲取電影資訊列表...');
  MaxPage = data['total_pages'] > 1 ? data['total_pages'] : -1;
  //進度條
  const Mainbar = new cliProgress.SingleBar(
    {
      format: '電影資訊獲取進度: [{bar}] {percentage}% |  {value}/{total}',
    },
    cliProgress.Presets.shades_classic,
  );
  Mainbar.start(data.total_results, 0);
  let barCounter = 0;
  while (cur_page <= MaxPage) {
    // To Search for movie ID
    await Sleep(200);
    try {
      console.log(`獲取第 ${cur_page}/${MaxPage} 頁電影資訊---`);
      const response = await GET(_URL + `&page=${cur_page}`, headers);
      const data: DiscoverResponse = response.data as DiscoverResponse;
      if (data?.['results'].length === 0) {
        break;
      }
      let resList: IMovie[] = data['results'] as IMovie[];
      resList = resList.filter(e => !isNaN(Date.parse(e.release_date))); //過濾掉為空或無法顯示的日期
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
