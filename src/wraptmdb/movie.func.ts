import { join, parse } from 'node:path';
import { WriteFile, WriteFileAsJSON } from '../utility/fileIO';
import {  GET, Sleep, downloadFile } from '../utility/httpmethod';

const metadataName = 'metadata.json';
//Step1
export async function DiscoverMovie(
  keywords: string[],
  path: string,
  TOKEN: string
): Promise<MovieI[]> {
  const CACHE: MovieI[] = [];
  let GLOBAL_COUNTER = 0;
  let str = '';
  let legn = keywords.length - 1;
  keywords.forEach((element: string) => {
    str += element;
    if (legn-- > 0) str += '|';
  });
  let cur_page = 1;
  let MaxPage = 1;



  const url = 'https://api.themoviedb.org/3/discover/movie?include_adult=true&language=zh-TW&sort_by=popularity.desc&with_keywords='+keywords.toString();
  const headers = {
    accept: 'application/json',
    Authorization: 'Bearer '+TOKEN,
  }

  //First request to get infomation
  const data: any = (await GET(url + `&page=${cur_page++}`,headers))['data'];
  const total_results = Object.prototype.hasOwnProperty.call(
    data,
    'total_results'
  )
    ? data['total_results']
    : 0;
  MaxPage = data['total_pages'] > 1 ? data['total_pages'] : -1;
  while (cur_page <= MaxPage) {
    // To Search for movie ID
    await Sleep(200);
    const data: any =  (await GET(url + `&page=${cur_page}`,headers))['data'];
    if (Array.isArray(data)||data?.['results'].length === 0) {
      break;
    }
    const resList = data['results'];
    //Generated json structure
    let cont = 0;
    for (let index = 0; index < resList.length; index++) {
      //turn into real folder
      CACHE.push(resList[index]);
      await GenerateFolder(resList[index], path, () => {
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
//Generate Folder by JSON structure
async function GenerateFolder(data: MovieI, parentpath: string, next: Function) {
  // Skip if has no name
  let Foldername = Object.prototype.hasOwnProperty.call(data, 'original_title')
    ? data['original_title']
    : '';
  if (Foldername === '') {
    next();
    return;
  }
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
    ''
  );
  //Add extra folders
  await WriteFile(join(parentpath + Foldername + '/' + 'Specials' + '/.gitkeep'), '');
  await WriteFile(join(parentpath + Foldername + '/' + 'Extras' + '/.gitkeep'), '');

  //Download poster
  let poster_pat = '';
  if (data['poster_path'] !== undefined && data['poster_path'] !== null) {
    const poster_url = 'https://image.tmdb.org/t/p/w500' + data['poster_path'];
    const ext = parse(data['poster_path']).ext;
    poster_pat = join(parentpath, Foldername, `poster${ext}`);
    await downloadFile(poster_url, poster_pat);
    data['poster_path'] = poster_pat;
  }

  //Add json as a tag
  await WriteFileAsJSON(join(parentpath, Foldername, metadataName), data);
  next();
  return data;
}

// Movie 結構
interface MovieI {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}
