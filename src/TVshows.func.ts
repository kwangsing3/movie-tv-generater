import * as wrapTMDB from 'wraptmdb-ts';
import {TVseries} from './model/model';
import {sleep} from './utility/httpmethod';

//Step1
export default async (
  keywords: string[],
  tarPath: string
): Promise<TVseries[]> => {
  const CACHE: TVseries[] = [];
  let GLOBAL_COUNTER = 1;
  //轉變keywords語法
  let keySTR = '';
  let legn = keywords.length - 1;
  keywords.forEach((element: string) => {
    keySTR += element;
    if (legn-- > 0) keySTR += '|';
  });
  let cur_page = 1;
  let MaxPage = 1;
  const query = {
    with_keywords: keySTR,
    with_watch_monetization_types: 'flatrate',
    include_adult: true,
    sort_by: 'popularity.desc',
    page: cur_page++,
    language: 'zh-TW',
  };
  //First request to get infomation
  const data = await wrapTMDB.Discover.GetTVDiscover(query);
  const total_results = Object.prototype.hasOwnProperty.call(
    data,
    'total_results'
  )
    ? data['total_results']
    : 0;
  MaxPage = data['total_pages'] > 1 ? data['total_pages'] : -1;

  while (cur_page <= MaxPage) {
    query.page = cur_page; //更新搜尋屬性
    await sleep(200);
    const data = await wrapTMDB.Discover.GetTVDiscover(query); // To Search in TVshows list.
    if (data['results'].length === 0) {
      continue;
    }
    const resList = data['results'];
    for (const ii of resList) {
      CACHE.push(ii);
      console.log(GLOBAL_COUNTER++ + '/' + total_results);
    }
    // //Generated json structure
    //const cont = 0;
    // for (const key of resList) {
    //   await GenerateFolder(key, tarPath, () => {
    //     console.log(GLOBAL_COUNTER++ + '/' + total_results);
    //     cont++;
    //   });
    // }
    // const skip = 0;
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

//
//
/*------------------Generate Logic------------------*/
