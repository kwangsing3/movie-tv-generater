import {GET, Sleep} from '../utility/httpmethod';
import {DiscoverResponse, ITVseries} from '../interface';

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
  const data: DiscoverResponse = await GET(
    url + `&page=${cur_page++}`,
    headers,
  );
  MaxPage = data['total_pages'] > 1 ? data['total_pages'] : -1;

  while (cur_page <= MaxPage) {
    //更新搜尋屬性
    await Sleep(200);
    const data: DiscoverResponse = await GET(
      url + `&page=${cur_page}`,
      headers,
    );
    if (data?.['results'].length === 0) {
      continue;
    }
    const resList: ITVseries[] = data['results'] as ITVseries[];
    resList.forEach(e => {
      e.poster_path = `https://image.tmdb.org/t/p/w500${e['poster_path']}`;
    });
    CACHE = [...CACHE, ...resList];
    cur_page++;
    if (process.env['MODE'] === 'DEBUG') break;
  }
  return CACHE;
}
