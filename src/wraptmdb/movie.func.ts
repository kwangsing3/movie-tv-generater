import {GET, Sleep} from '../utility/httpmethod';
import {DiscoverResponse, IMovie} from '../interface';

//Step1
export async function DiscoverMovie(
  keywords: string[],
  TOKEN: string,
): Promise<IMovie[]> {
  let CACHE: IMovie[] = [];
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
  MaxPage = data['total_pages'] > 1 ? data['total_pages'] : -1;

  while (cur_page <= MaxPage) {
    // To Search for movie ID
    await Sleep(200);
    const data: DiscoverResponse = await GET(
      url + `&page=${cur_page}`,
      headers,
    );
    if (data?.['results'].length === 0) {
      break;
    }
    const resList: IMovie[] = data['results'] as IMovie[];
    resList.forEach(e => {
      e.poster_path = `https://image.tmdb.org/t/p/w500${e['poster_path']}`;
    });
    CACHE = [...CACHE, ...resList];
    cur_page++;
    if (process.env['MODE'] === 'DEBUG') break;
  }
  return CACHE;
}