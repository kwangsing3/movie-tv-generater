import {WriteFile} from './utils/fs';
import {ReadFile} from './utils/fs';
async function main() {
  let gee = 'Hello module';

  for (let i = 0; i < 99; i++) {
    gee += 'Hello module';
  }

  await WriteFile('hi.txt', gee);

  const msg: string = await ReadFile('hi.txt');

  console.log(msg);
}

main();
