const core = require('@actions/core');
import * as wrapTMDB from 'wraptmdb-ts';

const gettvshowbykeywords = require('./module/gettvshowbykeywords');
const getmoviebykeywords = require('./module/getmoviebykeywords');

const isAction = false;
const TOKEN =
  process.env.TMDB_TOKEN === undefined || process.env.TMDB_TOKEN === ''
    ? process.argv[2]
    : process.env.TMDB_TOKEN;
//Setup wrapTMDB
wrapTMDB.Init(TOKEN);
wrapTMDB.SetHeader({
  'User-Agent': 'Movie-TV-Generater: Daily Update',
  Referer: 'https://github.com/kwangsing3/movie-tv-generater',
});
console.log('Hello World');
async function main() {
  //TV Shows
  try {
    await gettvshowbykeywords(['210024'], './output/tvshows/'); //anime: 210024
  } catch (error) {
    if (isAction) {
      core.setFailed(`${error}`);
    } else {
      console.error(error);
    }
  }
  //Movies
  try {
    await getmoviebykeywords(['210024'], './output/movie/');
  } catch (error) {
    if (isAction) {
      core.setFailed(`${error}`);
    } else {
      console.error(error);
    }
  }
}
const fs = require('fs');
//delete /output
fs.access('./output', fs.constants.F_OK, async (err: any) => {
  if (!err) {
    fs.rm('./output', {recursive: true}, (err: string | undefined) => {
      if (err) {
        throw new Error(err);
      }
      //main();
    });
  } else {
    //main();
  }
});
//# sourceMappingURL=index.js.map
