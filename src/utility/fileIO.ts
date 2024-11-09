import * as fs from 'node:fs/promises';
import {join} from 'path';
import {dirname} from 'path';

/** 寫入檔案，並自動檢查是否有相應的資料夾位置
 * @param path 檔案位置
 * @param content 檔案內容
 * @returns 檔案位置
 */
export async function WriteFile(
  targetPath: string,
  content: string,
): Promise<string> {
  const parentPath = dirname(targetPath);
  await MKDir(parentPath);
  targetPath = join(targetPath);
  await fs.writeFile(targetPath, content, 'utf-8');
  return targetPath;
}
/** 讀取檔案
 * @param targetPath 檔案位置
 * @returns Buffer-成功  {}-失敗
 */
export async function ReadFile(targetPath: string): Promise<string> {
  return fs.readFile(targetPath, 'utf8');
}
export async function ReadFileToJSON(targetPath: string): Promise<string> {
  const rawdata = await fs.readFile(targetPath, 'utf8');
  return JSON.parse(rawdata);
}

/**
 * 新增資料夾
 * @param dirPath 目標位置
 * @returns
 */
export async function MKDir(dirPath: string) {
  await fs.mkdir(dirPath, {recursive: true});
}

/**
 * 獲取目標位置的所有檔案名稱
 * @param dirPath 目標位置
 * @returns string[]
 */
export async function GetAllFilesName(dirPath: string): Promise<string[]> {
  return (await fs.readdir(dirPath, {withFileTypes: true}))
    .filter(dirent => !dirent.isDirectory())
    .map(dirent => dirent.name);
}
/**
 * 獲取目標位置的所有資料夾名稱
 * @param dirPath 目標位置
 * @returns string[]
 */
export const GetDirectories = async (dirPath: string): Promise<string[]> => {
  return (await fs.readdir(dirPath, {withFileTypes: true}))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
};

/**
 * 刪除檔案
 * @param path 檔案位置
 */
export async function DeleteFile(path: string) {
  await fs.unlink(path).catch(err => {
    console.log(err);
  });
}
