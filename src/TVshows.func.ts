import {join, parse} from 'node:path';
import {WriteFile, WriteFileAsJSON} from './utility/fileIO';
import * as wrapTMDB from 'wraptmdb-ts';
import {DownloadFile, sleep} from './utility/httpmethod';
import {TVseries} from './model/model';

//Step1
export default async (
  keywords: string[],
  tarPath: string
): Promise<TVseries[]> => {
  const CACHE: TVseries[] = [];
  let GLOBAL_COUNTER = 0;
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
    language: 'en-US',
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
    for (const ii of resList) CACHE.push(ii);
    // //Generated json structure
    let cont = 0;
    for (const key of resList) {
      await GenerateFolder(key, tarPath, () => {
        console.log(GLOBAL_COUNTER++ + '/' + total_results);
        cont++;
      });
    }
    let skip = 0;
    const cache = GLOBAL_COUNTER;
    while (cont !== resList.length) {
      if (cache === GLOBAL_COUNTER) {
        skip++;
      } else {
        skip = 0;
      }
      //console.log(GLOBAL_COUNTER);
      if (skip >= 800) {
        console.error('request break!');
        break;
      }
    }
    cur_page++;
    if (process.env['MODE'] === 'DEBUG') break;
  }
  return CACHE;
};

//
//
/*------------------Generate Logic------------------*/
const metadataName = 'metadata.json';
//Generate Folder by JSON structure
function GenerateFolder(data: TVseries, parentpath: string, next: Function) {
  // Skip if has no name
  let Foldername = data['original_name'];
  if (
    process.env['STATICFILE'] === 'false' ||
    Foldername === '' ||
    Foldername === undefined
  ) {
    next();
    return;
  }
  //Prefix Foldername
  Foldername = Foldername.replace(/[/\\?%*:|"<>]/g, '_');

  //Release date (Year)
  const strFirstAirDate = data['first_air_date'];
  const FirstAirDate = new Date(strFirstAirDate);
  const Year = FirstAirDate.getUTCFullYear();
  Foldername += ` (${Year})`;

  //.gitkeep: git will not track the folder if nothing in there
  WriteFile(
    join(parentpath + Foldername + '/' + `${Foldername}.cache.mkv`),
    ''
  );
  //Add extra folders
  WriteFile(join(parentpath + Foldername + '/' + 'Specials' + '/.gitkeep'), '');
  WriteFile(join(parentpath + Foldername + '/' + 'Extras' + '/.gitkeep'), '');

  //Download poster
  let poster_pat = '';
  if (data['poster_path'] !== undefined && data['poster_path'] !== null) {
    const poster_url = 'https://image.tmdb.org/t/p/w500' + data['poster_path'];
    const ext = parse(data['poster_path']).ext;
    poster_pat = join(parentpath, Foldername, `poster${ext}`);
    DownloadFile(poster_url, poster_pat);
    data['poster_path'] = poster_pat;
  }
  //Add json as a tag
  WriteFileAsJSON(join(parentpath, Foldername, metadataName), data);
  next();
  return data;
}
