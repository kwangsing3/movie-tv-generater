import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponseHeaders,
  RawAxiosResponseHeaders,
} from 'axios';
import {createWriteStream} from 'node:fs';
/**
 * 統一回覆格式
 */
type Result<T> = {
  success: boolean;
  data: T | null;
  status: number;
  statusText: string;
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
  config: AxiosRequestConfig;
};

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
): Promise<Result<T>> {
  const config: AxiosRequestConfig = {
    method: 'get',
    url: url,
    headers: headers,
    timeout: timeout ?? 15000,
  };
  //code 3xx 在一般情況下歸納成錯誤處理，這裡直接歸納回來
  if (maxRedirects === 0) {
    config.maxRedirects = maxRedirects;
    config.validateStatus = function (status: number) {
      return status >= 200 && status < 303;
    };
  }
  if (waitRateMS !== 0) await Sleep(GetRateLimit());
  cache = new Date();
  try {
    const response = await axios(config);
    return {
      success: true,
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config: response.config,
    };
  } catch (error) {
    return HandleAxiosError(error as AxiosError);
  }
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
  content: {[x: string]: string} | string,
  timeout?: number,
  maxRedirects?: number,
): Promise<Result<T>> {
  const config: AxiosRequestConfig = {
    method: 'post',
    url: url,
    data: content,
    headers: header,
    timeout: timeout ?? 15000,
  };
  //code 3xx 在一般情況下歸納成錯誤處理，這裡直接歸納回來
  if (maxRedirects === 0) {
    config.maxRedirects = maxRedirects;
    config.validateStatus = function (status: number) {
      return status >= 200 && status < 303;
    };
  }
  if (waitRateMS !== 0) await Sleep(GetRateLimit());
  cache = new Date();
  try {
    const response = await axios(config);
    return {
      success: true,
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config: response.config,
    };
  } catch (error) {
    return HandleAxiosError(error as AxiosError);
  }
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

// 錯誤處理函式
function HandleAxiosError(error: AxiosError) {
  // 伺服器回應的錯誤
  if (error.response) {
    console.error(`❌ 請求失敗： ${error.config?.url}
      狀態碼: ${error.response.status}
      訊息: ${error.response.statusText}
      資料: ${error.response.status === 404 ? '' : JSON.stringify(error.response.data)}`);
  } else if (error.request) {
    console.error('❌ 請求已發送，但未收到回應。'); // 沒有收到回應
  } else {
    console.error(`❌ 發生錯誤: ${error.message}`); // 發送請求時發生的其他錯誤
  }
  return {
    success: false,
    data: null,
    status: error.response?.status || 0,
    statusText: error.response?.statusText || 'Unknown Error',
    headers: error.response?.headers || {},
    config: error.config as AxiosRequestConfig, // 確保這裡的 config 是 AxiosRequestConfig 類型
  };
}
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
