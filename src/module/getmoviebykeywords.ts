import path = require("path");
import * as wrapTMDB from "wraptmdb-ts";
import { MKDir, WriteFile, WriteFileJSON } from "../utils/fs";
const cliProgress = require('cli-progress');

//Step1
export default async function Call(keywords:string[], path:string){
    let str = '';
    let legn = keywords.length-1;
    keywords.forEach(element => {
        str += element;
        if(legn-->0)
            str +='|';
    });
    const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    let cur_page: number = 1;
    let MaxPage: number = 1;
    const query = {
        with_keywords: str, 
        with_watch_monetization_types: 'flatrate',
        include_adult: true,
        sort_by: 'popularity.desc',
        page: cur_page,
        language: 'en-US'
    }
    //First request to get infomation
    const data = await wrapTMDB.Discover.GetMovieDiscover(query);
    const total_results = (Object.prototype.hasOwnProperty.call(data,'total_results'))?data['total_results']:0;
    MaxPage = data['total_pages']>1?data['total_pages']:-1;
    let current_result = 0;
    bar1.start(total_results, current_result);

    while(cur_page <= MaxPage){
        // To Search for movie ID
        query.page = cur_page;
        const data = await wrapTMDB.Discover.GetMovieDiscover(query);
        if(data['results'].length === 0){
            break;
        }
        let IDs:any = [];
        data['results'].forEach((element: { [x: string]: any; }) => {
            IDs.push(element['id']);
        });

        //Generated json structure
        for(let key of IDs) {
            const data = await wrapTMDB.Movies.GetDetails(key);
            //turn into real folder
            try {
                await GenerateFolder(data, path);
            } catch (error) {
                throw error;
            }
            bar1.update(current_result++);
        };
        cur_page++;
    }
    bar1.stop();
}

/*------------------Geaneate Logic------------------*/

const metadataName: string = 'metadata.mtg.txt';

//Generate Folder by JSON structure
function GenerateFolder(data: any, parentpath: string){

    // Skip if has no name
    let Foldername = (Object.prototype.hasOwnProperty.call(data,'original_title'))?data['original_title']:'';
    if(Foldername==='')
        return;
    //Prefix Foldername
    Foldername = Foldername
              .replace('/', '／')
              .replace('\\', '＼')
              .replace(':', '：');
    //Release date
    let strFirstAirDate = (Object.prototype.hasOwnProperty.call(data,'release_date'))?data['release_date']:'';
    let FirstAirDate = new Date(strFirstAirDate);
    let Year = FirstAirDate.getUTCFullYear();
    Foldername += ` (${Year})`;

    //Add a fake file to let fetcher can get metadata
    WriteFile(parentpath + Foldername + '/' + `${Foldername}.mtg.mkv`, null);


    //Add extra folders
    WriteFile(path.join(parentpath + Foldername + '/' + 'Specials' + '/.mtg.gitkeep'), null);
    WriteFile(path.join(parentpath + Foldername + '/' + 'Extras' + '/.mtg.gitkeep'), null);

    //Add json as a tag
    WriteFileJSON(path.join(parentpath + Foldername +'/'+ metadataName), data);
    
}