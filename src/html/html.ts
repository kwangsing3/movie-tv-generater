import {BaseSeries} from '../model/model';
import SCRIPT from './SCRIPT';
import HEAD from './HEAD';
/*
  年份 -> 1月、4月、7月、10月

  單位方框 (一個系列)
  1. 標題名稱
  2. 海報
  3. 分數
  4. 季度數量
  5. 最新集數(播到的集數)、開播日期 (最後播出時間)。
*/

const LATESTTVDate = '';
const LATESTMOVIEDate = '';
export default function RenderHTML(
  tvseries: BaseSeries[],
  movies: BaseSeries[]
): string {
  return `
    <!DOCTYPE html>
    ${HEAD()}
    <body>
    ${BODY(tvseries)}
    </body>
    ${SCRIPT(LATESTTVDate, LATESTMOVIEDate)}
    </html>
  `;
}

function BODY(input: BaseSeries[]): string {
  //日期分類***
  const struct: {[key: string]: {[key: string]: BaseSeries[]}} = {};
  for (const key of input) {
    if (key.first_air_date === undefined) continue;
    const date = new Date(key.first_air_date);
    const year = date.getUTCFullYear();
    const month = CalculateSeason(date.getUTCMonth() + 1); // 年份 -> 1月、4月、7月、10月
    if (Number.isNaN(year) || Number.isNaN(month)) continue; // ignore if no date
    struct[year] = struct[year] === undefined ? {} : struct[year];
    struct[year][month] =
      struct[year][month] === undefined ? [] : struct[year][month];
    struct[year][month].push(key);
  }

  let tabsContent = '<div id="tv" class="Maintabcontent">';
  const rsSTR: string[] = [];
  for (const Year in struct) rsSTR.push(CreateTAB(Year, struct[Year]));
  for (let i = rsSTR.length - 1; i > -1; i--) {
    tabsContent += rsSTR[i];
  }

  tabsContent += '</div>';
  return `
    <div class="tab">
      <button class="Maintablinks" onclick="openMainTab(event, 'tv')">TV</button>
      <button class="Maintablinks" onclick="openMainTab(event, 'movie')">Movie</button>
    </div>
    <!-- Tab links -->
    ${tabsContent}
  <footer class="copyright"> &copy; Copyright ${new Date().getFullYear()} <a href="https://github.com/kwangsing3/movie-tv-generater" target="_blank">kwangsing3</a>. All rights reserved.</footer> 
  `;
}

//
//
const imgWidth = '150px';

// 年是1個大TAB，月份是小Tab(包含4個)
function CreateTAB(year: string, input: {[x: string]: BaseSeries[]}): string {
  let tabs = `<div class="tab"><h2>${year}</h2>`;
  for (const month in input) {
    tabs += `
      <button class="tablinks" onclick="openTab(event, 'tv-${year}${month}')"> ${month}月</button>
    `;
  }
  tabs += '</div>';
  let res = '';
  for (const month in input) {
    res += `
    <div id="tv-${year}${month}" class="tabcontent">
      ${CreateContainer(input[month])}
    </div>
    `;
  }
  return tabs + res;
}

//一個小TAB內含一個Container (乘載各個單位方框)
function CreateContainer(tvseries: BaseSeries[]): string {
  let str = '<div class="container">';
  for (const key of tvseries) {
    str += GenerateItem(key);
  }
  str += '</div>';
  return str;
}

//單位方框 Entity
function GenerateItem(key: BaseSeries): string {
  const title = `<tr><td>${key.title}</td></tr>`;
  const poster = `
  <tr><td><img src="${
    key['poster_path']
      ? 'https://image.tmdb.org/t/p//w220_and_h330_face' + key['poster_path']
      : ''
  }" loading="lazy" class="poster" width="${imgWidth}" alt="${
    key.original_title
  }" /></td></tr>
  `;
  const releasedate = `<tr><td>${key?.['first_air_date']}</td></tr>`;
  return `
  <div class="item"><table>
    ${poster}
    ${releasedate}
    ${title}
  </table></div>
    `;
}
function CalculateSeason(month: number): string {
  if (month < 4) {
    return '1';
  } else if (month < 7) {
    return '4';
  } else if (month < 10) {
    return '7';
  } else if (!Number.isNaN(month)) {
    return '10';
  }
  return 'Nan';
}
