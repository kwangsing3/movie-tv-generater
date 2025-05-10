export interface DiscoverResponse {
  page: number;
  results: IBaseInfo[];
  total_pages: number;
  total_results: number;
}

export interface IBaseInfo {
  backdrop_path: string;
  id: number;
  genre_ids: number[];
  original_language: string;
  overview: string;
  popularity: number;
  poster_path: string;
  adult: boolean;
  vote_average: number;
  vote_count: number;
}

// TVseries 結構
export interface ITVseries extends IBaseInfo {
  name: string;
  original_name: string;
  first_air_date: string;
  origin_country: string[];
}
// Movie 結構
export interface IMovie extends IBaseInfo {
  title: string;
  original_title: string;
  release_date: string;
  video: boolean;
}
