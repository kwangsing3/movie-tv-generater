/* eslint-disable node/no-unsupported-features/node-builtins */
const axios = require('axios');
/**
 * GET method
 * @param url request path
 * @returns 取得伺服器回應
 */
export async function GET(url: string): Promise<object> {
  const config = {
    method: 'get',
    url: url,
    headers: {},
    timeout: 15000,
  };
  let data: object = {};

  try {
    const wait = GetRateLimit();
    if (wait !== 0) {
      await sleep(wait);
    }
    data = await axios(config);
    cache = new Date();
  } catch (error: any) {
    console.log(error);
  }
  return data;
}
/**
 * POST method
 * @param url request path
 * @param content request body
 * @returns 取決於伺服器實作，可能不會出現回傳。
 */
export async function POST(
  url: string,
  header: {[x: string]: string},
  content: {[x: string]: string}
): Promise<object> {
  const config = {
    method: 'post',
    url: url,
    data: content,
    headers: header,
  };
  let data: object = {};

  try {
    if (waitRateMS !== 0) {
      await sleep(GetRateLimit());
    }
    data = await axios(config);
    cache = new Date();
  } catch (error: any) {
    console.log(error['message']);
  }
  return data;
}

export function sleep(ms: number): Promise<unknown> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

/*
    製作目標:
       依照速率阻塞線程。
*/
let waitRateMS = 0;
let cache = new Date();
// 一分鐘可接受次數
export const SetRatePerMin = (ms: number) => {
  waitRateMS = 60000 / ms;
};

export const GetRateLimit = () => {
  const minus = new Date().getMilliseconds() - cache.getMilliseconds();

  return minus <= 0 ? 0 : waitRateMS - minus;
};

import {createWriteStream} from 'fs';
import * as stream from 'stream';
import {promisify} from 'util';
const pipeline = promisify(stream.pipeline);

/**
 * 下載檔案
 * @param fileUrl
 * @param outputLocationPath
 * @returns
 */
export async function DownloadFile(
  fileUrl: string,
  outputLocationPath: string
) {
  if (process.env['noDownload']) return;
  try {
    const wait = GetRateLimit();
    if (wait !== 0) {
      await sleep(wait);
    }
    const request = await axios.get(fileUrl, {
      responseType: 'stream',
    });
    await pipeline(request.data, createWriteStream(outputLocationPath));
  } catch (error) {
    console.error(`download ${fileUrl} pipeline failed: `, error);
  }
}
