import * as wrapTMDB from 'wraptmdb-ts';
import {BaseSeries} from './model/model';
import {sleep} from './utility/httpmethod';

const query = {
  with_keywords: '',
  with_watch_monetization_types: 'flatrate',
  include_adult: true,
  sort_by: 'popularity.desc',
  page: 1,
  language: 'zh-TW',
};

export default async (keywords: string[]): Promise<BaseSeries[]> => {
  const result: BaseSeries[] = [];
  let GLOBAL_COUNTER = 1;
  //轉變keywords語法
  let keySTR = '';
  let legn = keywords.length - 1;
  keywords.forEach((element: string) => {
    keySTR += element;
    if (legn-- > 0) keySTR += '|';
  });
  query.with_keywords = keySTR;
  let cur_page = 1;
  let MaxPage = 1;

  while (cur_page <= MaxPage) {
    query.page = cur_page; //更新搜尋屬性
    await sleep(200);
    const data = await wrapTMDB.Discover.GetTVDiscover(query); // To Search in TVshows list.
    if (data['results'].length === 0) {
      continue;
    }
    const resList = data['results'];
    for (const ii of resList) {
      result.push({
        id: ii['id'],
        title: ii['name'],
        poster_path: ii['poster_path'],
        adult: ii['adult'] !== undefined,
        genre_ids: ii['genre_ids'],
        first_air_date: ii['first_air_date'],
        backdrop_path: ii['backdrop_path'],
        original_language: ii['original_language'],
        original_title: ii['original_name'],
        Seasons: [],
        popularity: ii['popularity'],
        overview: ii['overview'],
        vote_average: ii['vote_average'],
        vote_count: ii['vote_count'],
      });
      console.log(GLOBAL_COUNTER++ + '/' + data?.['total_results']);
    }
    cur_page++;
    MaxPage = data['total_pages'] > 1 ? data['total_pages'] : -1;
    if (process.env['MODE'] === 'DEBUG') break;
  }
  return result;
};

//
//
/*------------------Generate Logic------------------*/
