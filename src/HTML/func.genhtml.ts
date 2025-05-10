import HEAD from './string.HEAD';
import {IBaseInfo, IMovie, ITVseries} from '../int.basic';

let LATESTTV = '';
export default function RenderHTML(data: IBaseInfo[]): string {
  return `
    <!DOCTYPE html>
    ${HEAD()}
    ${BODY(data)}
    ${SCRIPT()}
  `;
}

function BODY(dataList: IBaseInfo[]): string {
  //classfication***
  const TVstruct: {[key: string]: {[key: string]: ITVseries[]}} = {};
  for (const key of dataList) {
    //TV
    const tkey: any = key;
    const dd = tkey['first_air_date'] ?? tkey['release_date'];
    const date = new Date(dd);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    TVstruct[year] = TVstruct[year] ?? {};
    TVstruct[year][month] = TVstruct[year][month] ?? [];
    TVstruct[year][month].push(tkey);
  }
  //classfication***

  let tabsContent = '<div id="tv" class="Maintabcontent">';
  let STR_revers: string[] = [];
  for (const key in TVstruct) {
    STR_revers.push(CreateTAB(key, TVstruct[key]));
  }
  for (let i = STR_revers.length - 1; i > -1; i--) {
    tabsContent += STR_revers[i];
  }

  //find last key
  const arr_Y = Object.keys(TVstruct);
  let latestY = arr_Y[arr_Y.length - 1];
  const arr_M = Object.keys(TVstruct[latestY]);
  let latestM = arr_M[arr_M.length - 1];
  LATESTTV = latestY + latestM;
  tabsContent += '</div>';
  tabsContent += '<div id="movie" class="Maintabcontent">';
  STR_revers = [];
  for (let i = STR_revers.length - 1; i > -1; i--) {
    tabsContent += STR_revers[i];
  }
  latestY = arr_Y[arr_Y.length - 1];
  latestM = arr_M[arr_M.length - 1];
  tabsContent += '</div>';
  return `
  <body>
    <div class="tab">
      <a class="Maintablinks" href="./tv.html">TV</a>
      <a class="Maintablinks" href="./movie.html">Movie</a>
    </div>
    <!-- Tab links -->
    ${tabsContent}
  </body>
  <footer class="copyright"> 
    &copy; Copyright ${new Date().getFullYear()} <a href="https://github.com/kwangsing3/movie-tv-generater" target="_blank">kwangsing3</a>. All rights reserved.
  </footer> 
  `;
}

function SCRIPT(): string {
  return `
  <script>
    function openTab(evt, tabID) {
      // Declare all variables
      var i, tabcontent, tablinks;
      var skip = false;
      // Get all elements with class="tabcontent" and hide them
      tabcontent = document.getElementsByClassName("tabcontent");
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
      if(evt &&  !evt.currentTarget.className.includes("Maintablinks") && evt.currentTarget.className.includes("active")) skip = true;

      // Get all elements with class="tablinks" and remove the class "active"
      tablinks = document.getElementsByClassName("tablinks");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace("active", "");
      }
      if(skip) return;


      // Show the current tab, and add an "active" class to the button that opened the tab
      document.getElementById(tabID).style.display = "flex";
      if(evt)
        evt.currentTarget.className += " active";
    }
    function openMainTab(evt, tabID) {
      // Declare all variables
      var i, tabcontent, tablinks;
      var skip = false;
      // Get all elements with class="tabcontent" and hide them
      tabcontent = document.getElementsByClassName("Maintabcontent");
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
      if(evt && !evt.currentTarget.className.includes("Maintablinks") &&  evt.currentTarget.className.includes("active")) skip = true;

      // Get all elements with class="tablinks" and remove the class "active"
      tablinks = document.getElementsByClassName("Maintablinks");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
      }
      if(skip) return;
      // Show the current tab, and add an "active" class to the button that opened the tab
      document.getElementById(tabID).style.display = "block";
      if(evt)
        evt.currentTarget.className += " active";

      openTab(event, 'T${LATESTTV}')
    }
    openMainTab(event, 'tv');
    openTab(event,'T${LATESTTV}')
  </script>
  `;
}

function makeUNIT_TV(tvseries: IBaseInfo[]): string {
  let str = '';
  for (const key of tvseries) {
    const tkey: any = key;
    str += `
      <div class="container">
        <div>${tkey['name'] ?? tkey['title']}</div>
        <img src="${key['poster_path'] ?? ''}" alt="" />
      </div>
    `;
  }
  return str;
}
function CreateTAB(year: string, input: {[x: string]: ITVseries[]}): string {
  let tabs = `<div class="tab"><h2>${year}</h2>`;
  for (const month in input) {
    tabs += `
      <button class="tablinks" onclick="openTab(event, 'T${year}${month}')">${month}月</button>
    `;
  }
  tabs += '</div>';
  let res = '';
  for (const month in input) {
    res += `
    <div id="T${year}${month}" class="tabcontent">
      ${makeUNIT_TV(input[month])}
    </div>
    `;
  }
  return tabs + res;
}
