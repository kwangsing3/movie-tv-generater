import {join, parse} from 'node:path';
import {WriteFile, WriteFileAsJSON} from '../utility/fileIO';
import * as wrapTMDB from 'wraptmdb-ts';
import {SendToSturct} from './struct';
import {DownloadFile} from '../utility/httpmethod';
//Step1
export default async (keywords: any[], path: string) => {
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
    page: cur_page,
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
  let cur_count = 1;
  while (cur_page <= MaxPage) {
    // To Search for movie ID
    query.page = cur_page;
    const data = await wrapTMDB.Discover.GetMovieDiscover(query);
    if (data['results'].length === 0) {
      break;
    }
    const IDs: any[] = [];
    data['results'].forEach((element: {[x: string]: any}) => {
      IDs.push(element['id']);
    });
    //Generated json structure
    for (const key of IDs) {
      const data = await wrapTMDB.Movies.GetDetails(key);
      //turn into real folder
      await GenerateFolder(data, path);
      SendToSturct('movie', data);
      console.log(`Movies: ${cur_count++}/${total_results}`);
    }
    cur_page++;
  }
};
/*------------------Geaneate Logic------------------*/
const metadataName = 'metadata.json';
//Generate Folder by JSON structure
async function GenerateFolder(data: {[x: string]: any}, parentpath: string) {
  // Skip if has no name
  let Foldername = Object.prototype.hasOwnProperty.call(data, 'original_title')
    ? data['original_title']
    : '';
  if (Foldername === '') return;
  //Prefix Foldername
  Foldername = Foldername.replace(/[/\\?%*:|"<>]/g, '_');
  //Release date
  const strFirstAirDate = Object.prototype.hasOwnProperty.call(
    data,
    'release_date'
  )
    ? data['release_date']
    : '';
  const FirstAirDate = new Date(strFirstAirDate);
  const Year = FirstAirDate.getUTCFullYear();
  Foldername += ` (${Year})`;
  //Add a fake file to let fetcher can get metadata
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

  //Download poster
  let poster_pat = '';
  if (data['poster_path'] !== undefined && data['poster_path'] !== null) {
    const poster_url = 'https://image.tmdb.org/t/p/w500' + data['poster_path'];
    const ext = parse(data['poster_path']).ext;
    poster_pat = join(parentpath, Foldername, `poster${ext}`);
    await DownloadFile(poster_url, poster_pat);
  }

  //Add json as a tag
  await WriteFileAsJSON(join(parentpath, Foldername, metadataName), data);
  data['poster_path'] = poster_pat;
  return data;
}
