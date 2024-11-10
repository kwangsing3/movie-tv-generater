import {join, parse} from 'node:path';
import {IBaseInfo} from './interface';
import {WriteFile} from './utility/fileIO';
import {DownloadFile} from './utility/httpmethod';

//
//Generate Folder by JSON structure
/*------------------Generate Logic------------------*/
const metadataName = 'metadata.json';
/**
 * 生成本地結構 (添加Season、Special、Extra資料夾)
 * @param Foldername 資料夾名稱 + 年份
 * @param data 影集結構
 * @param dirPath  資料夾位置
 * @returns
 */
export async function GenerateFolder(
  Foldername: string,
  data: IBaseInfo,
  dirPath: string,
) {
  if (Foldername === '' || Foldername === undefined) {
    return; // Skip if has no name
  }
  //Prefix Foldername
  Foldername = Foldername.replace(/[/\\?%*:|"<>]/g, '_');
  // Add extra folders
  //.gitkeep: git will not track the folder if nothing in there, so need an empty file.
  await WriteFile(join(dirPath + Foldername, `${Foldername}.cache.mkv`), '');
  await WriteFile(join(dirPath + Foldername + '/Specials/.gitkeep'), '');
  await WriteFile(join(dirPath + Foldername + '/Extras/.gitkeep'), '');

  //Download poster
  let poster_pat = '';
  if (data['poster_path'] !== undefined && data['poster_path'] !== null) {
    const poster_url = `https://image.tmdb.org/t/p/w500${data['poster_path']}`;
    const ext = parse(data['poster_path']).ext;
    poster_pat = join(dirPath, Foldername, `poster${ext}`);
    await DownloadFile(poster_url, poster_pat);
    data['poster_path'] = poster_pat;
  }
  //Add json as a tag
  await WriteFile(
    join(dirPath, Foldername, metadataName),
    JSON.stringify(data, null, 4),
  );
  return data;
}
