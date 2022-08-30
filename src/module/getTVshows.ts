import {join} from 'node:path';
import {WriteFile, WriteFileAsJSON} from '../utility/fileIO';
import * as wrapTMDB from 'wraptmdb-ts';

//
//
//
//
// image host: https://image.tmdb.org/t/p/w500/
//
//
//Step1
export default async (keywords: string[], path: string) => {
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
    page: cur_page,
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
  const current_result = 0;
  while (cur_page <= MaxPage) {
    query.page = cur_page; //更新搜尋屬性
    const data = await wrapTMDB.Discover.GetTVDiscover(query); // To Search in TVshows list.
    if (data['results'].length === 0) {
      continue;
    }
    const IDs: any[] = []; //擷取 TVshows ID
    const resList = data['results'];
    resList.forEach((element: {[x: string]: any}) => {
      IDs.push(element['id']);
    });
    //Generated json structure
    for (const key of IDs) {
      const data = await wrapTMDB.TV.GetDetails(key, 'zh-tw');
      //turn into real folder
      await GenerateFolder(data, path);
    }
    cur_page++;
  }
};

//
//
//
//
//
/*------------------Generate Logic------------------*/
const metadataName = 'metadata.json';
//Generate Folder by JSON structure
async function GenerateFolder(data: {[x: string]: any}, parentpath: string) {
  // Skip if has no name
  let Foldername = data['original_name'];
  if (Foldername === '' || Foldername === undefined) return;
  //Prefix Foldername
  Foldername = Foldername.replace('/', '／')
    .replace('\\', '＼')
    .replace(':', '：');
  //Release date (Year)
  const strFirstAirDate = data['first_air_date'];
  const FirstAirDate = new Date(strFirstAirDate);
  const Year = FirstAirDate.getUTCFullYear();
  Foldername += ` (${Year})`;
  // Seasons
  const Seasons = Object.prototype.hasOwnProperty.call(data, 'seasons')
    ? data['seasons']
    : [];
  for (const season of Seasons) {
    //Season name
    let name = Object.prototype.hasOwnProperty.call(season, 'name')
      ? season['name']
      : '';
    if (name === '' || name === 'Specials' || name === 'Extras') {
      continue;
    }
    //prefix Season index (有些季別不會特別標示Season)
    const season_number = Object.prototype.hasOwnProperty.call(
      season,
      'season_number'
    )
      ? season['season_number']
      : -1;
    if (!name.includes(`Season ${season_number}`)) {
      name = `Season ${season_number} - ${name}`;
    }
    // Episode Count (ignore if there's no episodes)
    const episode_count = Object.prototype.hasOwnProperty.call(
      season,
      'episode_count'
    )
      ? season['episode_count']
      : -1;
    if (episode_count < 1) {
      continue;
    }
    //.gitkeep: git will not track the folder if nothing in there
    await WriteFile(
      join(parentpath + Foldername + '/' + `${Foldername}.cache.mkv`),
      null
    );
    //Add extra folders
    await WriteFile(
      join(parentpath + Foldername + '/' + 'Specials' + '/.gitkeep'),
      null
    );
    await WriteFile(
      join(parentpath + Foldername + '/' + 'Extras' + '/.gitkeep'),
      null
    );
    //Add json as a tag
    await WriteFileAsJSON(
      join(parentpath + Foldername + '/' + metadataName),
      data
    );
  }
}
