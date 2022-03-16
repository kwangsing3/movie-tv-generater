import * as core from '@actions/core'
import * as wrapTMDB from "wraptmdb-ts";
import Gen_TVShowbyKeyword from './module/gettvshowbykeywords';
import Gen_MoviebyKeyword from './module/getmoviebykeywords';

const isAction = false;
let TOKEN = (process.env.TMDB_TOKEN === undefined || process.env.TMDB_TOKEN === '')?process.argv[2]:process.env.TMDB_TOKEN;

//Set wrapTMDB
wrapTMDB.Init(TOKEN);
wrapTMDB.SetHeader({
  'User-Agent':
    'Movie-TV-Generater: Daily Update',
  Referer: 'https://github.com/kwangsing3/movie-tv-generater',
});

async function main() {
  //TV Shows
  try {
    await Gen_TVShowbyKeyword(['210024'], './output/tvshows/');  //anime: 210024
  } catch (error) {
    if(isAction){
      core.setFailed(`${error}`);
    }else{
      console.error(error);
    }
  }
  //Movies
  try {
    await Gen_MoviebyKeyword(['210024'], './output/movie/');
  } catch (error) {
    if(isAction){
      core.setFailed(`${error}`);
    }else{
      console.error(error);
    }
  }
}

const fs = require('fs');
//delete /output
fs.access('./output', fs.constants.F_OK,  async (err: any) => {
  if(!err){
    fs.rm('./output', { recursive: true }, (err: any) => {
      if(err){
        throw new Error(err);
      }
      main();
    });
  }else{
    main();
  }
});