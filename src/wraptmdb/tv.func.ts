import {join, parse} from 'node:path';
import {WriteFile} from '../utility/fileIO';
import {GET, Sleep, downloadFile} from '../utility/httpmethod';
import {DiscoverResponse, ITVseries} from '../interface';

//Step1
export async function DiscoverTV(
  keywords: string[],
  tarPath: string,
  TOKEN: string,
): Promise<ITVseries[]> {
  let CACHE: ITVseries[] = [];
  let GLOBAL_COUNTER = 0;
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

  const data: DiscoverResponse = await GET(url + '&page=1', headers);
  const total_results = Object.prototype.hasOwnProperty.call(
    data,
    'total_results',
  )
    ? data['total_results']
    : 0;
  MaxPage = data['total_pages'] > 1 ? data['total_pages'] : -1;

  while (cur_page <= MaxPage) {
    //更新搜尋屬性
    await Sleep(200);
    const data: DiscoverResponse = await GET(
      url + `&page=${cur_page}`,
      headers,
    );
    if (data['results'].length === 0) {
      continue;
    }
    const resList: ITVseries[] = data['results'] as ITVseries[];
    CACHE = [...CACHE, ...resList];
    // //Generated json structure
    let cont = 0;
    for (const key of resList) {
      await GenerateFolder(key, tarPath).then(() => {
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
//Generate Folder by JSON structure
/*------------------Generate Logic------------------*/
const metadataName = 'metadata.json';
async function GenerateFolder(data: ITVseries, parentpath: string) {
  let Foldername = data['name'] ?? data['original_name'];
  if (Foldername === '' || Foldername === undefined) {
    return; // Skip if has no name
  }
  //Prefix Foldername
  Foldername = Foldername.replace(/[/\\?%*:|"<>]/g, '_');
  //Release date (Year)
  const strFirstAirDate = data['first_air_date'];
  const FirstAirDate = new Date(strFirstAirDate);
  const Year = FirstAirDate.getUTCFullYear();
  Foldername += ` (${Year})`;

  // Add extra folders
  //.gitkeep: git will not track the folder if nothing in there, so need an empty file.
  await WriteFile(join(parentpath + Foldername, `${Foldername}.cache.mkv`), '');
  await WriteFile(join(parentpath + Foldername + '/Specials/.gitkeep'), '');
  await WriteFile(join(parentpath + Foldername + '/Extras/.gitkeep'), '');

  //Download poster
  let poster_pat = '';
  if (data['poster_path'] !== undefined && data['poster_path'] !== null) {
    const poster_url = `https://image.tmdb.org/t/p/w500${data['poster_path']}`;
    const ext = parse(data['poster_path']).ext;
    poster_pat = join(parentpath, Foldername, `poster${ext}`);
    await downloadFile(poster_url, poster_pat);
    data['poster_path'] = poster_pat;
  }
  //Add json as a tag
  await WriteFile(
    join(parentpath, Foldername, metadataName),
    JSON.stringify(data, null, 4),
  );
  return data;
}
