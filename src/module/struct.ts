//
// image host: https://image.tmdb.org/t/p/original/
//
//

import {EOL} from 'node:os';
import {join} from 'node:path';
import {WriteFileAsJSON} from '../utility/fileIO';

// 搜尋到的動漫架構
export const tv_struct: any = {};
export const movie_struct: any = {};

export function SendToSturct(tag: 'tv' | 'movie', input: any) {
  switch (tag) {
    case 'tv':
      SendTV(input);
      break;
    case 'movie':
      SendMovie(input);
      break;
    default:
      break;
  }
}

function SendTV(input: any) {
  const ori_name = input['original_name'];
  const Seasons = input['seasons'];
  const year = new Date(input['first_air_date']).getUTCFullYear();
  if (Seasons === undefined || Seasons.length < 2) {
    const resDate = filterTV(new Date(input['first_air_date']));
    if (!Object.prototype.hasOwnProperty.call(tv_struct, resDate))
      tv_struct[resDate] = {};
    tv_struct[resDate][ori_name] = {
      episode_count: input['episode_count'],
      id: input['id'],
      poster_path: input['poster_path'],
    };
  } else {
    for (const key of Seasons) {
      const resDate = filterTV(new Date(key['air_date']));
      if (!Object.prototype.hasOwnProperty.call(tv_struct, resDate))
        tv_struct[resDate] = {};
      tv_struct[resDate][`${ori_name} (${year})`] = {
        episode_count: key['episode_count'],
        id: key['id'],
        poster_path: key['poster_path'],
      };
    }
  }
}
function SendMovie(input: any) {
  const ori_name = input['original_title'];
  const dat = new Date(input['release_date']);
  const resDate = `${dat.getUTCFullYear()}-${dat.getMonth()}`;
  if (!Object.prototype.hasOwnProperty.call(movie_struct, resDate))
    movie_struct[resDate] = {};
  movie_struct[resDate][ori_name] = {
    id: input['id'],
    poster_path: input['poster_path'],
  };
}

const filterTV = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  return `${year}-${((month + 1) % 3) * 3 + 1}`;
};

export const WriteStruct = async (tag: 'tv' | 'movie', pat: string) => {
  switch (tag) {
    case 'tv':
      await WriteFileAsJSON(join(pat, '../', 'tv_struct.json'), tv_struct);
      return PrefixTV(tv_struct);
    case 'movie':
      await WriteFileAsJSON(
        join(pat, '../', 'movie_struct.json'),
        movie_struct
      );
      return PrefixMovie(movie_struct);
    default:
      break;
  }
  return '';
};
const imgSTR = (pat: String) => {
  return `<img src="${pat}"  width="120" height="180"/>`;
};
export function PrefixMovie(input: any) {
  //input = sample;
  let result = '';
  result = '';
  const filt: any = {};
  //依照日期組成一組，之後再反轉(讓最新的擺在前面)
  for (const index in input) {
    const key = input[index];
    const keys = Object.keys(key);
    const size = keys.length;
    const date = index;
    const year = date.slice(0, 4);
    //製作日期標頭
    let tmp = `# ${date}`;
    tmp += `${EOL}`;

    for (let i = 0; i < size; i++) {
      //貼上海報
      tmp += `${EOL}`;
      tmp += `|${imgSTR(key[keys[i]]['poster_path'])}|${keys[i]} (${year})|`;
      tmp += `${EOL}`;
      tmp += '|--|--|';
      tmp += `${EOL}`;
    }
    tmp += `${EOL}`;
    filt[date] = tmp;
  }
  const properties = Object.keys(filt).sort().reverse();
  for (const i of properties) {
    if (i.includes('NaN')) continue;
    result += `${filt[i]}${EOL}${EOL}`;
  }
  result += `${filt['NaN-NaN']}${EOL}${EOL}`;
  //
  // 轉譯成純文字 (最新的優先)

  //
  //
  return result;
}
export function PrefixTV(input: any) {
  return '777';
}

/*
2007-7| ---- | ----
---- | ---- | ----
aaa |劇場版 NARUTO -ナルト- 疾風伝|aaa
aaa |劇場版 NARUTO -ナルト- 疾風伝|aaa
*/
