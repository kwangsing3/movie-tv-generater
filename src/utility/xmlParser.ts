const xml2js = require('xml2js');

/**
 * 將檔案分析成物件(Object)
 * @param content 傳入自檔案獲得的字串
 * @returns JSON
 */
export async function ParseXML(content: string): Promise<any> {
  // With parser
  const parser = new xml2js.Parser(/* options */);
  return parser.parseStringPromise(content);
}
