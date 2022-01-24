export declare class GETFetcher {
    constructor(url?: string, token?: string, lang?: string);
    /**
     * property
     */
    private url;
    private token;
    private lang;
    private bar1;
    private header;
    /**
     * method
     */
    GetURL(): string;
    SetToken(input: string): void;
    GetToken(): string;
    GenerateFolderbyKeyword(input: string, offset: string): Promise<void>;
    private GetListWithKeyWordsAndPages;
    GetSeriesInfo(BaseURL: string, id: string): Promise<any>;
}
