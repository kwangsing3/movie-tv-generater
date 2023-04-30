import {Movie, TVseries} from './model/model';
let LATESTTV = '';
let LATESTMOVIE = '';
export default function RenderHTML(
  tvseries: TVseries[],
  movies: Movie[]
): string {
  return `
    <!DOCTYPE html>
    ${HEAD()}
    ${BODY(tvseries, movies)}
    ${SCRIPT()}
    </html>
  `;
}

function HEAD(): String {
  return `
  <head>
  <title>Movie-TV-Generater</title>
    ${STYLE()}
  </head>
  `;
}
function BODY(tvseries: TVseries[], movies: Movie[]): string {
  //classfication***
  const TVstruct: {[key: string]: {[key: string]: TVseries[]}} = {};
  for (const key of tvseries) {
    if (key.first_air_date === undefined) continue;
    //TV
    const date = new Date(key.first_air_date);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    if (Number.isNaN(year) || Number.isNaN(month)) continue;
    if (!Object.prototype.hasOwnProperty.call(TVstruct, year))
      TVstruct[year] = {};
    if (!Object.prototype.hasOwnProperty.call(TVstruct[year], month))
      TVstruct[year][month] = [];
    TVstruct[year][month].push(key);
  }

  //Movie
  const MOVstruct: {[key: string]: {[key: string]: Movie[]}} = {};
  for (const key of movies) {
    if (key.release_date === undefined) continue;
    //Movie
    const date = new Date(key.release_date);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    if (Number.isNaN(year) || Number.isNaN(month)) continue;
    if (!Object.prototype.hasOwnProperty.call(MOVstruct, year))
      MOVstruct[year] = {};
    if (!Object.prototype.hasOwnProperty.call(MOVstruct[year], month))
      MOVstruct[year][month] = [];
    MOVstruct[year][month].push(key);
  }

  //classfication***
  let tabsContent = '<div id="tv" class="Maintabcontent">';
  let reversSTR: string[] = [];
  for (const key in TVstruct) {
    reversSTR.push(CreateTAB(key, TVstruct[key]));
  }
  for (let i = reversSTR.length - 1; i > -1; i--) {
    tabsContent += reversSTR[i];
  }
  //find last key
  let arr_Y = Object.keys(TVstruct);
  let latestY = arr_Y[arr_Y.length - 1];
  let arr_M = Object.keys(TVstruct[latestY]);
  let latestM = arr_M[arr_M.length - 1];
  LATESTTV = latestY + latestM;
  //
  tabsContent += '</div>';
  tabsContent += '<div id="movie" class="Maintabcontent">';
  reversSTR = [];
  for (const key in MOVstruct) {
    reversSTR.push(CreateMTAB(key, MOVstruct[key]));
  }
  for (let i = reversSTR.length - 1; i > -1; i--) {
    tabsContent += reversSTR[i];
  }
  arr_Y = Object.keys(MOVstruct);
  latestY = arr_Y[arr_Y.length - 1];
  arr_M = Object.keys(MOVstruct[latestY]);
  latestM = arr_M[arr_M.length - 1];
  LATESTMOVIE = latestY + latestM;
  tabsContent += '</div>';
  return `
  <body>
    <div class="tab">
      <button class="Maintablinks" onclick="openMainTab(event, 'tv')">TV</button>
      <button class="Maintablinks" onclick="openMainTab(event, 'movie')">Movie</button>
    </div>
    <!-- Tab links -->
    ${tabsContent}
  </body>
  <footer class="copyright"> &copy; Copyright ${new Date().getFullYear()} <a href="https://github.com/kwangsing3/movie-tv-generater" target="_blank">kwangsing3</a>. All rights reserved.</footer> 
  `;
}
function STYLE(): string {
  return `
  <style>
    /* Style the tab */
    .tab {
      overflow: hidden;
      border: 1px solid #ccc;
      background-color: #f1f1f1;
    }

    /* Style the buttons that are used to open the tab content */
    .tab button {
      background-color: inherit;
      float: left;
      border: none;
      outline: none;
      cursor: pointer;
      padding: 14px 16px;
      transition: 0.3s;
    }

    /* Change background color of buttons on hover */
    .tab button:hover {
      background-color: #ddd;
    }

    /* Create an active/current tablink class */
    .tab button.active {
      background-color: #ccc;
    }

    /* Style the tab content */
    .tabcontent {
      display: none;
      padding: 6px 12px;
      border: 1px solid #ccc;
      border-top: none;
    }
    .Maintablinks {
      font-size: 150%;
      font-weight:bold;
    }
    .copyright {
      text-align: center;
      padding: 2%;
    }
    body {
      margin: 0 auto;
    }
    .container {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-start;
      margin: 0 auto;
      padding: 0 0.5rem 1rem;
      position: relative;
      transition: all 2s;
    }
    .container > div.item {
      align-items: center;
      background-color: hsl(133, 100%, 80%);
      display: flex;
      flex: 0 1 auto;
      justify-content: center;
      outline: 3px solid green;
      margin: 0.5rem;
      padding: 0.5rem;
      position: relative;
        min-height: 100px;
        width: 150px;
      transition: top 0.5s, left 0.5s;
    }
  </style>
  `;
}
function SCRIPT(): string {
  return `
  <script>
    function openTab(evt, cityName) {
      // Declare all variables
      var i, tabcontent, tablinks;
      var skip = false;
      // Get all elements with class="tabcontent" and hide them
      tabcontent = document.getElementsByClassName("tabcontent");
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
      if(evt &&  !evt.currentTarget.className.includes("tablinks") && evt.currentTarget.className.includes("active")) skip = true;

      // Get all elements with class="tablinks" and remove the class "active"
      tablinks = document.getElementsByClassName("tablinks");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace("active", "");
      }
      if(skip) return;


      // Show the current tab, and add an "active" class to the button that opened the tab
      document.getElementById(cityName).style.display = "block";
      if(evt)
        evt.currentTarget.className += " active";
    }
    function openMainTab(evt, cityName) {
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
      document.getElementById(cityName).style.display = "block";
      if(evt)
        evt.currentTarget.className += " active";

      openTab(event, (cityName === 'tv'?'${LATESTTV}':'${LATESTMOVIE}'))
    }
    openMainTab(event, 'tv');
    openTab(event,${LATESTTV})



  </script>
  `;
}
const imgWidth = '150px';
function makeTableMOVIE(movies: Movie[]): string {
  let str = '<div class="container">';
  for (const key of movies) {
    str += `<div class="item"><table>
    <tr><td>${
      key?.['title'] ? key?.['title'] : key?.['original_title']
    }</td></tr>
    <tr><td>${key?.['release_date']}</td></tr>
    <tr><td><img src="${
      key['poster_path']
        ? 'https://image.tmdb.org/t/p/w500' + key['poster_path']
        : ''
    }" loading="lazy" width="${imgWidth}" alt="${
      key.original_title
    }" /></td></tr></table></div>
    `;
  }
  str += '</div>';
  return str;
}
function makeTableTV(tvseries: TVseries[]): string {
  let str = '<div class="container">';
  for (const key of tvseries) {
    str += `<div class="item"><table>
    <tr><td>${key?.['name'] ? key?.['name'] : key?.['original_name']}</td></tr>
    <tr><td>${key['first_air_date']}</td></tr>
    <tr><td><img src="${
      key['poster_path']
        ? 'https://image.tmdb.org/t/p/w500' + key['poster_path']
        : ''
    }" loading="lazy" width="${imgWidth}" alt="${
      key.original_name
    }" /></td></tr></table></div>
    `;
  }
  str += '</div>';
  return str;
}
function CreateTAB(year: string, input: {[x: string]: TVseries[]}): string {
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
      ${makeTableTV(input[month])}
    </div>
    `;
  }
  return tabs + res;
}
function CreateMTAB(year: string, input: {[x: string]: Movie[]}): string {
  let tabs = `<div class="tab"><h2>${year}</h2>`;
  for (const month in input) {
    tabs += `
      <button class="tablinks" onclick="openTab(event, 'movie-${year}${month}')"> ${month}月</button>
    `;
  }
  tabs += '</div>';
  let res = '';
  for (const month in input) {
    res += `
    <div id="movie-${year}${month}" class="tabcontent">
      ${makeTableMOVIE(input[month])}
    </div>
    `;
  }
  return tabs + res;
}
