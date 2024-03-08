import {join, parse} from 'node:path';
import {WriteFile, WriteFileAsJSON} from '../utility/fileIO';
import {DownloadFile, GET, Sleep} from '../utility/httpmethod';

//Step1
export async function DiscoverTV(
  keywords: string[],
  tarPath: string,
  TOKEN: string
): Promise<TVseriesI[]> {
  const CACHE: TVseriesI[] = [];
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

  const url =
    'https://api.themoviedb.org/3/discover/tv?include_adult=true&include_null_first_air_dates=false&language=zh-tw&sort_by=popularity.desc&with_keywords='+keywords.toString();
  const headers =  {
    accept: 'application/json',
    Authorization: 'Bearer '+TOKEN,
  };

  const data: any = (await GET(url+'&page=1', headers))['data'];
  const total_results = Object.prototype.hasOwnProperty.call(
    data,
    'total_results'
  )
    ? data['total_results']
    : 0;
  MaxPage = data['total_pages'] > 1 ? data['total_pages'] : -1;

  while (cur_page <= MaxPage) {
    query.page = cur_page; //更新搜尋屬性
    await Sleep(200);
    const data: any =  (await GET(url+`&page=${cur_page}`, headers))['data'];
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
}

//
//
/*------------------Generate Logic------------------*/
const metadataName = 'metadata.json';
//Generate Folder by JSON structure
function GenerateFolder(data: TVseriesI, parentpath: string, next: Function) {
  // Skip if has no name
  let Foldername = data['original_name'];
  if (Foldername === '' || Foldername === undefined) {
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

// TVseries 結構
interface TVseriesI {
  backdrop_path: string;
  first_air_date: string;
  genre_ids: number[];
  id: number;
  name: string;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
}
