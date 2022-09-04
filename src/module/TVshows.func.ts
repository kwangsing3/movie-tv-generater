import {join, parse} from 'node:path';
import {WriteFile, WriteFileAsJSON} from '../utility/fileIO';
import * as wrapTMDB from 'wraptmdb-ts';
import {SendToSturct} from './struct';
import {DownloadFile} from '../utility/httpmethod';

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
  let cur_count = 1;
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
    for (let index = 0; index < IDs.length; index++) {
      let data = await wrapTMDB.TV.GetDetails(IDs[index], 'zh-tw');
      //turn into real folder
      data = await GenerateFolder(data, path);
      SendToSturct('tv', data);
      console.log(`TVshows: ${cur_count++}/${total_results}`);
      if (
        process.env['MODE'] === 'DEBUG' &&
        index.toString() === process.env['AMOUNT']
      )
        break;
    }
    cur_page++;
    if (process.env['MODE'] === 'DEBUG') break;
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
  Foldername = Foldername.replace(/[/\\?%*:|"<>]/g, '_');

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
    //Season name, prefix Season index (有些季別不會特別標示Season)
    let SeasonName = Object.prototype.hasOwnProperty.call(season, 'name')
      ? season['name']
      : '';
    if (
      SeasonName === '' ||
      SeasonName === 'Specials' ||
      SeasonName === 'Extras'
    ) {
      continue;
    }
    const season_number = Object.prototype.hasOwnProperty.call(
      season,
      'season_number'
    )
      ? season['season_number']
      : -1;
    if (!SeasonName.includes(`Season ${season_number}`)) {
      SeasonName = `Season ${season_number} - ${SeasonName}`;
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

    //prefix folder name
    SeasonName = SeasonName.replace(/[/\\?%*:|"<>]/g, '_');
    //.gitkeep
    await WriteFile(join(parentpath, Foldername, SeasonName, '.gitkeep'), '');
    //
    //Download season poster
    if (season['poster_path'] !== undefined && season['poster_path'] !== null) {
      const poster_url =
        'https://image.tmdb.org/t/p/w500' + season['poster_path'];
      let poster_pat = '';
      const ext = parse(season['poster_path']).ext;
      poster_pat = join(parentpath, Foldername, SeasonName, `poster${ext}`);
      await DownloadFile(poster_url, poster_pat);
      season['poster_path'] = poster_pat;
    }
  }
  //.gitkeep: git will not track the folder if nothing in there
  await WriteFile(
    join(parentpath + Foldername + '/' + `${Foldername}.cache.mkv`),
    ''
  );
  //Add extra folders
  await WriteFile(
    join(parentpath + Foldername + '/' + 'Specials' + '/.gitkeep'),
    ''
  );
  await WriteFile(
    join(parentpath + Foldername + '/' + 'Extras' + '/.gitkeep'),
    ''
  );

  //Download poster
  let poster_pat = '';
  if (data['poster_path'] !== undefined && data['poster_path'] !== null) {
    const poster_url = 'https://image.tmdb.org/t/p/w500' + data['poster_path'];
    const ext = parse(data['poster_path']).ext;
    poster_pat = join(parentpath, Foldername, `poster${ext}`);
    await DownloadFile(poster_url, poster_pat);
    data['poster_path'] = poster_pat;
  }

  //Add json as a tag
  await WriteFileAsJSON(join(parentpath, Foldername, metadataName), data);
  return data;
}
