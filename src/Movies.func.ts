import * as wrapTMDB from 'wraptmdb-ts';
import {sleep} from './utility/httpmethod';
import {Movie} from './model/model';

//Step1
export default async (keywords: string[], path: string): Promise<Movie[]> => {
  const CACHE: Movie[] = [];
  const GLOBAL_COUNTER = 0;
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
    language: 'en-US',
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
    //Generated json structure
    // const cont = 0;
    for (let index = 0; index < resList.length; index++) {
      //turn into real folder
      CACHE.push(resList[index]);
      // await GenerateFolder(resList[index], path, () => {
      //   console.log(GLOBAL_COUNTER++ + '/' + total_results);
      //   cont++;
      // });
    }
    // let skip = 0;
    // const cache = GLOBAL_COUNTER;
    // while (cont !== resList.length) {
    //   if (cache === GLOBAL_COUNTER) {
    //     skip++;
    //   } else {
    //     skip = 0;
    //   }
    //   //console.log(GLOBAL_COUNTER);
    //   if (skip >= 800) {
    //     console.error('request break!');
    //     break;
    //   }
    // }
    cur_page++;
    if (process.env['MODE'] === 'DEBUG') break;
  }
  return CACHE;
};
