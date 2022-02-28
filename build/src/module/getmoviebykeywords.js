"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const wrapTMDB = require("wraptmdb-ts");
const fs_1 = require("../utils/fs");
const cliProgress = require('cli-progress');
//Step1
async function Call(keywords, path) {
    let str = '';
    let legn = keywords.length - 1;
    keywords.forEach(element => {
        str += element;
        if (legn-- > 0)
            str += '|';
    });
    const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    let cur_page = 1;
    let MaxPage = 1;
    const query = {
        with_keywords: str,
        with_watch_monetization_types: 'flatrate',
        include_adult: true,
        sort_by: 'popularity.desc',
        page: cur_page,
        language: 'en-US'
    };
    //First request to get infomation
    const data = await wrapTMDB.Discover.GetMovieDiscover(query);
    const total_results = (Object.prototype.hasOwnProperty.call(data, 'total_results')) ? data['total_results'] : 0;
    MaxPage = data['total_pages'] > 1 ? data['total_pages'] : -1;
    let current_result = 0;
    bar1.start(total_results, current_result);
    while (cur_page <= MaxPage) {
        // To Search for movie ID
        query.page = cur_page;
        const data = await wrapTMDB.Discover.GetMovieDiscover(query);
        if (data['results'].length === 0) {
            break;
        }
        let IDs = [];
        data['results'].forEach((element) => {
            IDs.push(element['id']);
        });
        //Generated json structure
        for (let key of IDs) {
            const data = await wrapTMDB.Movies.GetDetails(key);
            //turn into real folder
            try {
                await GenerateFolder(data, path);
            }
            catch (error) {
                throw error;
            }
            bar1.update(current_result++);
        }
        ;
        cur_page++;
    }
    bar1.stop();
}
exports.default = Call;
/*------------------Geaneate Logic------------------*/
const metadataName = 'metadata.mtg.txt';
//Generate Folder by JSON structure
function GenerateFolder(data, parentpath) {
    // Skip if has no name
    let Foldername = (Object.prototype.hasOwnProperty.call(data, 'original_title')) ? data['original_title'] : '';
    if (Foldername === '')
        return;
    //Prefix Foldername
    Foldername = Foldername
        .replace('/', '／')
        .replace('\\', '＼')
        .replace(':', '：');
    //Release date
    let strFirstAirDate = (Object.prototype.hasOwnProperty.call(data, 'release_date')) ? data['release_date'] : '';
    let FirstAirDate = new Date(strFirstAirDate);
    let Year = FirstAirDate.getUTCFullYear();
    Foldername += ` (${Year})`;
    //Add a fake file to let fetcher can get metadata
    (0, fs_1.WriteFile)(parentpath + Foldername + '/' + `${Foldername}.mtg.mkv`, null);
    //Add extra folders
    (0, fs_1.WriteFile)(path.join(parentpath + Foldername + '/' + 'Specials' + '/.mtg.gitkeep'), null);
    (0, fs_1.WriteFile)(path.join(parentpath + Foldername + '/' + 'Extras' + '/.mtg.gitkeep'), null);
    //Add json as a tag
    (0, fs_1.WriteFileJSON)(path.join(parentpath + Foldername + '/' + metadataName), data);
}
//# sourceMappingURL=getmoviebykeywords.js.map