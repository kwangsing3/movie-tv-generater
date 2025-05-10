import RenderHTML from './HTML/func.genhtml';
import {WriteFile} from './utility/fileIO';
import {join} from 'path';

export default async () => {
  if (process.env['MODE'] !== 'DEBUG') return;
  const html = RenderHTML([]);
  await WriteFile(join('index.html'), html);
  throw 'Early out';
};
