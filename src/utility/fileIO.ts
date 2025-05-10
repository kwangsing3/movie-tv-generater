import {mkdir, readdir, readFile, writeFile, rm} from 'fs/promises';
import {join, dirname} from 'path';

/** 寫入檔案，並自動檢查是否有相應的資料夾位置
 * @async
 * @function
 * @param path 檔案位置
 * @param content 檔案內容
 */
export async function WriteFile(targetPath: string, content: string) {
  const parentPath = dirname(targetPath);
  await MKDir(parentPath);
  targetPath = join(targetPath);
  await writeFile(targetPath, content, 'utf-8');
}

/** 讀取檔案
 * @param targetPath 檔案位置
 * @returns Buffer-成功  {}-失敗
 */
export async function ReadFile(targetPath: string): Promise<string> {
  return await readFile(targetPath, 'utf8');
}

/**
 * 建立資料夾，如果路徑不存在會依序建立路徑
 * @param tarPath
 * @async
 * @function
 */
export async function MKDir(tarPath: string) {
  if (tarPath === '') return;
  tarPath = join(tarPath);
  await mkdir(tarPath, {recursive: true});
}

/**
 * 獲取路徑內所有檔案的名稱
 * @param dirPath
 * @param recursive
 * @returns
 */
export async function GetFilesOrFoldersName(
  dirPath: string,
  type: 'file' | 'folder',
  recursive?: boolean,
): Promise<string[]> {
  try {
    const files = (
      await readdir(dirPath, {
        withFileTypes: true,
        recursive: recursive ?? false,
      })
    )
      .filter(dirent =>
        type === 'file' ? dirent.isFile() : dirent.isDirectory(),
      )
      .map(dirent => dirent.name);
    return files;
  } catch (err) {
    console.error('Error reading names:', err);
    return [];
  }
}

/**
 * 刪除檔案
 * @param path 檔案位置
 */
export async function DeleteFile(path: string) {
  await rm(path).catch((err: unknown) => {
    console.error(err);
  });
}
