import {BaseSeries} from './model/model';
import {WriteFile, WriteFileAsJSON} from './utility/fileIO';
import {join, parse} from 'node:path';
import {DownloadFile} from './utility/httpmethod';

const metadataName = 'metadata.json';
//Generate Folder by JSON structure
export default function GenerateFolder(
  data: BaseSeries,
  parentpath: string,
  next: Function
) {
  // Skip if has no name
  let Foldername = data['original_title'];
  if (
    process.env['STATICFILE'] === 'false' ||
    Foldername === '' ||
    Foldername === undefined
  ) {
    next();
    return;
  }
  //Prefix Foldername
  Foldername = Foldername.replace(/[/\\?%*:|"<>]/g, '_');

  //Release date (Year)
  const strFirstAirDate = data['first_air_date'];
  const FirstAirDate = new Date(strFirstAirDate);
  const Year = FirstAirDate.getUTCFullYear();
  Foldername += ` (${Year})`;

  //.gitkeep: git will not track the folder if nothing in there
  WriteFile(
    join(parentpath + Foldername + '/' + `${Foldername}.cache.mkv`),
    ''
  );
  //Add extra folders
  WriteFile(join(parentpath + Foldername + '/' + 'Specials' + '/.gitkeep'), '');
  WriteFile(join(parentpath + Foldername + '/' + 'Extras' + '/.gitkeep'), '');

  //Download poster
  let poster_pat = '';
  if (data['poster_path'] !== undefined && data['poster_path'] !== null) {
    const poster_url = 'https://image.tmdb.org/t/p/w500' + data['poster_path'];
    const ext = parse(data['poster_path']).ext;
    poster_pat = join(parentpath, Foldername, `poster${ext}`);
    DownloadFile(poster_url, poster_pat);
    data['poster_path'] = poster_pat;
  }
  //Add json as a tag
  WriteFileAsJSON(join(parentpath, Foldername, metadataName), data);
  next();
  return data;
}
