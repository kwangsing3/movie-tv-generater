import * as wrapTMDB from 'wraptmdb-ts';
import {sleep} from './utility/httpmethod';
import {BaseSeries} from './model/model';

//Step1
export default async (keywords: string[]): Promise<BaseSeries[]> => {
  const result: BaseSeries[] = [];
  let GLOBAL_COUNTER = 1;
  let str = '';
  let legn = keywords.length - 1;
  keywords.forEach((element: string) => {
    str += element;
    if (legn-- > 0) str += '|';
  });
  let cur_page = 1;
  let MaxPage = 1;
  const query = {
    with_keywords: str,
    with_watch_monetization_types: 'flatrate',
    include_adult: true,
    sort_by: 'popularity.desc',
    page: cur_page++,
    language: 'zh-TW',
  };
  //First request to get infomation
  const data = await wrapTMDB.Discover.GetMovieDiscover(query);
  const total_results = Object.prototype.hasOwnProperty.call(
    data,
    'total_results'
  )
    ? data['total_results']
    : 0;
  MaxPage = data['total_pages'] > 1 ? data['total_pages'] : -1;
  while (cur_page <= MaxPage) {
    // To Search for movie ID
    query.page = cur_page;
    await sleep(200);
    const data = await wrapTMDB.Discover.GetMovieDiscover(query);
    if (data['results'].length === 0) {
      break;
    }
    const resList = data['results'];
    for (const key of resList) {
      //turn into real folder
      result.push({
        id: key['id'],
        title: key['title'],
        poster_path: key['poster_path'],
        adult: key['adult'],
        genre_ids: key['genre_ids'],
        first_air_date: key['release_date'],
        backdrop_path: key['backdrop_path'],
        original_language: key['original_language'],
        original_title: key['original_title'],
        Seasons: [],
        popularity: key['popularity'],
        overview: key['overview'],
        vote_average: key['vote_average'],
        vote_count: key['vote_count'],
      });
      console.log(GLOBAL_COUNTER++ + '/' + total_results);
    }

    cur_page++;
    if (process.env['MODE'] === 'DEBUG') break;
  }
  return result;
};
