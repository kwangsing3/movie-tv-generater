const axios = require('axios');
/**
 * GET method
 * @param url request path
 * @returns 取得伺服器回應
 */
export async function GET(url: string): Promise<any> {
  const config = {
    method: 'get',
    url: url,
    headers: {},
    timeout: 15000,
  };
  let data: any = {};

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
  header: any,
  content: any
): Promise<any> {
  const config = {
    method: 'post',
    url: url,
    data: content,
    headers: header,
  };
  let data: any = {};

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

function sleep(ms: number): Promise<unknown> {
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
