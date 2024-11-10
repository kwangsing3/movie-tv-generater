import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {createWriteStream} from 'fs';

/**
 * GET method
 * @param url request path
 * @returns 取得伺服器回應
 */
export async function GET<T>(
  url: string,
  headers?: {[x: string]: string},
  timeout?: number,
  maxRedirects?: number,
): Promise<T> {
  const config: AxiosRequestConfig = {
    method: 'get',
    url: url,
    headers: headers,
    timeout: timeout === undefined ? 15000 : timeout,
  };
  if (maxRedirects === 0) {
    config.maxRedirects = maxRedirects;
    config.validateStatus = function (status: number) {
      return status >= 200 && status < 303;
    };
  }
  if (waitRateMS !== 0) await Sleep(GetRateLimit());
  const response: AxiosResponse<T> = await axios(config);
  cache = new Date();
  return response.data;
}

/**
 * POST method
 * @param url request path
 * @param content request body
 * @returns 取決於伺服器實作，可能不會出現回傳。
 */
export async function POST<T>(
  url: string,
  header: {[x: string]: string},
  content: {[x: string]: string},
  timeout?: number,
  maxRedirects?: number,
): Promise<T> {
  const config: AxiosRequestConfig = {
    method: 'post',
    url: url,
    data: content,
    headers: header,
    timeout: timeout === undefined ? 15000 : timeout,
  };
  if (maxRedirects === 0) {
    config.maxRedirects = maxRedirects;
    config.validateStatus = function (status: number) {
      return status >= 200 && status < 303;
    };
  }
  if (waitRateMS !== 0) await Sleep(GetRateLimit());
  const response: AxiosResponse<T> = await axios(config);
  cache = new Date();
  return response.data;
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
export const DownloadFile = async (url: string, filePath: string) => {
  // TODO: 先取消下載，待要製作結構功能時再開啟。
  const ff = false;
  if (!ff) return;
  //
  const writer = createWriteStream(filePath);
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    // Handle errors
    console.error('Error downloading file:', error);
    throw error;
  }
};
