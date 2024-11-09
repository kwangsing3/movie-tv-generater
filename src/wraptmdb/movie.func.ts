import {join, parse} from 'node:path';
import {WriteFile} from '../utility/fileIO';
import {GET, Sleep, downloadFile} from '../utility/httpmethod';
import {DiscoverResponse, IMovie} from '../interface';

const metadataName = 'metadata.json';
//Step1
export async function DiscoverMovie(
  keywords: string[],
  path: string,
  TOKEN: string,
): Promise<IMovie[]> {
  let CACHE: IMovie[] = [];
  let GLOBAL_COUNTER = 0;
  let cur_page = 1;
  let MaxPage = 1;

  const url =
    'https://api.themoviedb.org/3/discover/movie?include_adult=true&language=zh-TW&sort_by=popularity.desc&with_keywords=' +
    keywords.toString();
  const headers = {
    accept: 'application/json',
    Authorization: 'Bearer ' + TOKEN,
  };

  //First request to get infomation
  const data: DiscoverResponse = await GET(
    url + `&page=${cur_page++}`,
    headers,
  );
  const total_results = data['total_results'] ?? 0;
  MaxPage = data['total_pages'] > 1 ? data['total_pages'] : -1;

  while (cur_page <= MaxPage) {
    // To Search for movie ID
    await Sleep(200);
    const data: DiscoverResponse = await GET(
      url + `&page=${cur_page}`,
      headers,
    );
    if (Array.isArray(data) || data?.['results'].length === 0) {
      break;
    }
    const resList: IMovie[] = data['results'] as IMovie[];
    //Generated json structure
    let cont = 0;
    CACHE = [...CACHE, ...resList];

    for (const key of resList) {
      await GenerateFolder(key, path).then(() => {
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
async function GenerateFolder(data: IMovie, parentpath: string) {
  // Skip if has no name
  let Foldername = data['original_title'] ?? data['title'];
  if (Foldername === '') {
    return;
  }
  //Prefix Foldername
  Foldername = Foldername.replace(/[/\\?%*:|"<>]/g, '_');
  //Release date
  const FirstAirDate = new Date(data['release_date'] ?? '');
  const Year = FirstAirDate.getUTCFullYear();
  Foldername += ` (${Year})`;

  //Add a fake file to let fetcher can get metadata
  await WriteFile(join(parentpath + Foldername, `${Foldername}.cache.mkv`), '');
  await WriteFile(join(parentpath + Foldername + '/Specials/.gitkeep'), '');
  await WriteFile(join(parentpath + Foldername + '/Extras/.gitkeep'), '');

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
  await WriteFile(
    join(parentpath, Foldername, metadataName),
    JSON.stringify(data, null, 4),
  );
  return data;
}
