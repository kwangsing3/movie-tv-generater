async function DiscoverMovie(
  keywords: string[],
  path: string,
  TOKEN: string
): Promise<MovieI[]> {
  return [];
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
