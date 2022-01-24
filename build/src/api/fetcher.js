"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GETFetcher = void 0;
const axios = require('axios');
const cont = require('../content/content');
const fs_1 = require("../utils/fs");
const fs_2 = require("../utils/fs");
const cliProgress = require('cli-progress');
class GETFetcher {
    constructor(url = '', token = '', lang = 'en-US') {
        this.url = url;
        this.token = token;
        this.lang = lang;
        this.bar1 = new cliProgress.SingleBar({
            format: 'CLI Progress |' + '|{percentage}% || Amount: {value}/{total}',
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            hideCursor: true,
        });
        this.header = {
            headers: {
                'User-Agent': 'Movie-Series-Generater/dev (+https://github.com/kwangsing3/Movie-Series-Generater)',
                Referer: 'https://github.com/kwangsing3/Movie-Series-Generater',
            },
        };
    }
    /**
     * method
     */
    GetURL() {
        return this.url;
    }
    SetToken(input) {
        this.token = input;
    }
    GetToken() {
        return this.token;
    }
    async GenerateFolderbyKeyword(input, offset) {
        let Search = {};
        let currentPage = 1;
        let total_pages = 0;
        let total_result = 0;
        let count = 0;
        const tempURL = this.url +
            (offset === 'series'
                ? cont.DISCOVERTV
                : offset === 'movies'
                    ? cont.DISCOVERMOVIE
                    : '');
        if (tempURL === '') {
            throw Error('Unknow offset text');
        }
        try {
            Search = await this.GetListWithKeyWordsAndPages(tempURL, input, currentPage);
        }
        catch (error) {
            console.error(error);
        }
        let list = Search.results;
        total_pages = Search['total_pages'];
        total_result = Search['total_results'];
        this.bar1.start(total_result, count, {
            counter: 'N/A',
        });
        while (currentPage !== -1) {
            // Get Search List
            try {
                Search = await this.GetListWithKeyWordsAndPages(tempURL, input, currentPage);
            }
            catch (error) {
                console.error(error);
            }
            if (Search === '') {
                throw Error('Search Fetch with null return');
            }
            list = Search['results'];
            const GETinfoURL = this.url +
                (offset === 'series'
                    ? cont.TVINFO
                    : offset === 'movies'
                        ? cont.MOVIEINFO
                        : '');
            // Get info
            for (let i = 0; i < list.length; i++) {
                const element = list[i];
                let data = {};
                const id = element.id;
                if (offset === 'series') {
                    try {
                        data = await this.GetSeriesInfo(GETinfoURL, id);
                        const seasonName = [];
                        data['seasons'].forEach((key) => {
                            seasonName.push(key['name']);
                        });
                        const Name = data['name']
                            .replace('/', '／')
                            .replace('\\', '＼')
                            .replace(':', '：');
                        const oriName = data['original_name']
                            .replace('/', '／')
                            .replace('\\', '＼')
                            .replace(':', '：');
                        const airDate = data['first_air_date'] !== null
                            ? data['first_air_date'].split('-')[0]
                            : '(-)';
                        const pathL = [];
                        const keyname = `${offset}/${oriName}(${airDate})`;
                        pathL.push(`./output/${keyname}`);
                        pathL.push(`./output/${keyname}/Specials`);
                        pathL.push(`./output/${keyname}/Extras`);
                        seasonName.forEach(keys => {
                            pathL.push(`./output/${keyname}/${keys}`);
                        });
                        await pathL.forEach(async (keys) => {
                            await (0, fs_1.MKDir)(keys);
                        });
                        //Make tag
                        await (0, fs_2.WriteFile)(pathL[0] + '/cache.txt', JSON.stringify({
                            name: Name,
                            id: id,
                            original_name: oriName,
                            seasons: data['seasons'],
                            season_amount: data['seasons'].length,
                            episodes_amount: data['number_of_episodes'],
                        }));
                    }
                    catch (error) {
                        console.error('\n' + 'Error ID:' + id + ' error:' + error);
                    }
                }
                else if (offset === 'movies') {
                    try {
                        data = await this.GetSeriesInfo(GETinfoURL, id);
                        const Name = data['title']
                            .replace('/', '／')
                            .replace('\\', '＼')
                            .replace(':', '：');
                        const oriName = data['original_title']
                            .replace('/', '／')
                            .replace('\\', '＼')
                            .replace(':', '：');
                        const airDate = data['release_date'] !== null
                            ? data['release_date'].split('-')[0]
                            : '(-)';
                        const keyname = `./output/${offset}/${oriName}(${airDate})_${Name}`;
                        //await MKDir(keyname);
                        //Make tag
                        await (0, fs_2.WriteFile)(keyname + '/cache.txt', JSON.stringify({
                            name: Name,
                            id: id,
                            original_name: oriName,
                            release: data['release_date'],
                        }));
                    }
                    catch (error) {
                        console.error('\n' + 'Error ID:' + id + ' error:' + error);
                    }
                }
                this.bar1.update(++count); // prograss bar
            }
            currentPage =
                currentPage === -1
                    ? -1
                    : currentPage + 1 > total_pages
                        ? -1
                        : currentPage + 1;
        }
        this.bar1.stop();
    }
    async GetListWithKeyWordsAndPages(urlPath, keyword, index = 1) {
        let result = {};
        if (keyword.length === 0) {
            return result;
        }
        const targetURl = urlPath +
            `?api_key=${this.token}` +
            `&language=${this.lang}` +
            '&sort_by=first_air_date.desc' +
            '&include_null_first_air_dates=false' +
            `&with_keywords=${keyword}` +
            `&page=${index}`;
        const data = await axios.get(targetURl, this.header);
        result = data.data;
        return result;
    }
    async GetSeriesInfo(BaseURL, id) {
        const URL = BaseURL + '/' + id + `?api_key=${this.token}&&language=${this.lang}`;
        const data = await axios.get(URL, this.header);
        return data.data;
    }
}
exports.GETFetcher = GETFetcher;
//# sourceMappingURL=fetcher.js.map