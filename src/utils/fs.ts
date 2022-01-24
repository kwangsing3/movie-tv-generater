import * as fs from 'fs';
import {join} from 'path';
import {dirname} from 'path';

export async function WriteFile(
  targetPath: string,
  content: string
): Promise<void> {
  await MKDir(dirname(targetPath)).then(() => {
    targetPath = join(targetPath);
    const splitPath = targetPath.split(join('/'));
    let finalPath = '';
    splitPath.forEach(element => {
      element = element.replace(/[/\\?%*:|"<>]/g, '-');
      finalPath += join('/') + element;
    });
    fs.writeFile(join('.' + finalPath), content, err => {
      if (err) {
        console.error('/n' + err.message);
      }
    });
  });
}
export async function MKDir(name: string) {
  if (name === '') return;
  name = join(name);
  const splitPath = name.split(join('/'));
  let finalPath = './';
  splitPath.forEach(element => {
    element = element.replace(/[/\\?%*:|"<>]/g, '-');
    finalPath += element + '/';
  });
  fs.mkdir(join(finalPath), {recursive: true}, err => {
    if (err) return console.error('/n' + err);
  });
}
export async function ReadFile(targetPath: string): Promise<string> {
  return new Promise(resolve => {
    fs.readFile(targetPath, (err, data) => {
      if (err) throw err;
      resolve(String(data));
    });
  });
}
