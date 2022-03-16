import * as fs from 'fs';
import {join} from 'path';
import {dirname} from 'path';

// WriteFile
export function WriteFile(
  targetPath: string,
  content: any
){
  let parentPath = dirname(targetPath);
   MKDir(parentPath,() => {
    targetPath = join(targetPath);
    const splitPath = targetPath.split(join('/'));
    let finalPath = '';
    splitPath.forEach(element => {
      element = element.replace(/[/\\?%*:|"<>]/g, '-');
      finalPath += join('/') + element;
    });
    fs.writeFile(join('.' + finalPath), JSON.stringify(content), err => {
      if (err) {
        let debugPath = targetPath;
        console.error(`ParentPath: ${debugPath}`+ err.message);
      }
    });
  });
}

export function WriteFileJSON(
  targetPath: string,
  content: any
){
  let parentPath = dirname(targetPath);
   MKDir(parentPath, () => {
    targetPath = join(targetPath);
    const splitPath = targetPath.split(join('/'));
    let finalPath = '';
    splitPath.forEach(element => {
      element = element.replace(/[/\\?%*:|"<>]/g, '-');
      finalPath += join('/') + element;
    });
    fs.writeFile(join('.' + finalPath), JSON.stringify(content, null, 4), err => {
      if (err) {
        let debugPath = targetPath;
        console.error(`ParentPath: ${debugPath}`+ err.message);
      }
    });
  });
}


// ReadFile
export function ReadFile(targetPath: string): Promise<string> {
  return new Promise(resolve => {
    fs.readFile(targetPath, (err, data) => {
      if (err) throw err;
      resolve(JSON.stringify(data));
    });
  });
}
// Make Folder with recursive
export async function MKDir(name: string, callback:Function ) {
  if (name === '') return;
  name = join(name);
  const splitPath = name.split(join('/'));
  let finalPath = './';
  splitPath.forEach(element => {
    element = element.replace(/[/\\?%*:|"<>]/g, '-');
    finalPath += element + '/';
  });
  fs.mkdir(join(finalPath), {recursive: true}, err => {
    if (err) {
      console.error('/n' + err);
    }
    callback();
  });
}