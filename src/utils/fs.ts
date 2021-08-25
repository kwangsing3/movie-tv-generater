import * as fs from 'fs';
import {join} from 'path';

export function WriteFile(targetPath: string, content: string): void {
  fs.writeFile(join(targetPath), content, err => {
    if (err) console.error(err.message);
    console.log(`Generated ${targetPath}`);
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
module.exports.WriteFile = WriteFile;
module.exports.ReadFile = ReadFile;
