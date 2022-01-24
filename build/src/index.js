"use strict";
const fs = require('fs');
async function main() {
    /*const TMDB = 'https://api.themoviedb.org/3';
    let TMDBToken = (process.env.TMDB_TOKEN = getInput('TMDB_TOKEN'));
    const isAction = false;
  
    if (TMDBToken === '') {
      TMDBToken = process.env.TMDB_TOKEN = 'fbb39f0aef28e8abfd66552fa76a4d2b';
    }
    //TMDb
    const TMDBFetcher: GETFetcher = new GETFetcher(TMDB, TMDBToken, 'en-US');
  
    try {
      await TMDBFetcher.GenerateFolderbyKeyword('210024', 'series');
    } catch (error) {
      console.error(error);
    }
    try {
      await TMDBFetcher.GenerateFolderbyKeyword('210024', 'movies');
    } catch (error) {
      console.error(error);
    }
    console.log('--Generate Finish--');*/
    /* test.json:
    {
        "a": 1,
        "b": 2,
        "c": 3,
    }
    */
}
fs.writeFile('./test.json', JSON.stringify({ a: 1, b: 2, c: 3, time: JSON.stringify(new Date()) }, null, '\t'), () => { });
//# sourceMappingURL=index.js.map