import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream";

const axios = require('axios');
/**
 * GET method
 * @param url request path
 * @returns 取得伺服器回應
 */
export async function GET(
  url: string,
  headers?: any,
  maxRedirects?: number
): Promise<any> {
  const config: any = {
    method: 'get',
    url: url,
    headers: headers,
    timeout: 15000,
  };
  if (maxRedirects === 0) {
    config.maxRedirects = maxRedirects;
    config.validateStatus = function (status: number) {
      return status >= 200 && status < 303;
    };
  }
  let data: any = {};

  try {
    const wait = GetRateLimit();
    if (wait !== 0) {
      await Sleep(wait);
    }
    data = await axios(config);
    cache = new Date();
  } catch (error: any) {
    console.error(error['message']);
    throw error;
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
  header: any,
  content: any,
  maxRedirects?: number
): Promise<any> {
  const config: any = {
    method: 'post',
    url: url,
    data: content,
    headers: header,
  };
  if (maxRedirects === 0) {
    config.maxRedirects = maxRedirects;
    config.validateStatus = function (status: number) {
      return status >= 200 && status < 303;
    };
  }
  let data: any = {};

  try {
    if (waitRateMS !== 0) {
      await Sleep(GetRateLimit());
    }
    data = await axios(config);
    cache = new Date();
  } catch (error: any) {
    console.log(error['message']);
  }
  return data;
}
/*
  依照速率阻塞線程。
*/
export function Sleep(ms: number): Promise<unknown> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

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
      await Sleep(wait);
    }
    const request = await axios.get(fileUrl, {
      responseType: 'stream',
    });
    await pipeline(request.data, createWriteStream(outputLocationPath));
  } catch (error) {
    console.error(`download ${fileUrl} pipeline failed: `, error);
  }
}