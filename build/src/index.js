"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const wrapTMDB = require("wraptmdb-ts");
const gettvshowbykeywords_1 = require("./module/gettvshowbykeywords");
const getmoviebykeywords_1 = require("./module/getmoviebykeywords");
const isAction = false;
let TOKEN = (process.env.TMDB_TOKEN === undefined || process.env.TMDB_TOKEN === '') ? process.argv[2] : process.env.TMDB_TOKEN;
//Set wrapTMDB
wrapTMDB.Init(TOKEN);
wrapTMDB.SetHeader({
    'User-Agent': 'Movie-TV-Generater: Daily Update',
    Referer: 'https://github.com/kwangsing3/movie-tv-generater',
});
async function main() {
    //TV Shows
    try {
        await (0, gettvshowbykeywords_1.default)(['210024'], './output/tvshows/'); //anime: 210024
    }
    catch (error) {
        if (isAction) {
            core.setFailed(`${error}`);
        }
        else {
            console.error(error);
        }
    }
    //Movies
    try {
        await (0, getmoviebykeywords_1.default)(['210024'], './output/movie/');
    }
    catch (error) {
        if (isAction) {
            core.setFailed(`${error}`);
        }
        else {
            console.error(error);
        }
    }
}
const fs = require('fs');
//delete /output
fs.access('./output', fs.constants.F_OK, async (err) => {
    if (!err) {
        fs.rm('./output', { recursive: true }, (err) => {
            if (err) {
                throw new Error(err);
            }
            main();
        });
    }
    else {
        main();
    }
});
//# sourceMappingURL=index.js.map