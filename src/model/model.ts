//基礎結構
export interface BaseSeries {
  id: number;
  title: string;
  poster_path: string;
  adult: boolean;
  genre_ids: number[];
  first_air_date: string;
  backdrop_path: string;
  original_language: string;
  original_title: string;
  Seasons: Season[];
  popularity: number;
  overview: string;
  vote_average: number;
  vote_count: number;
}

export interface Season {
  air_date: string;
  episode_count: string;
  id: string;
  name: string;
  overview: string;
  poster_path: string;
  season_number: string;
}
