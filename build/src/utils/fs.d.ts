export declare function WriteFile(targetPath: string, content: any): void;
export declare function WriteFileJSON(targetPath: string, content: any): void;
export declare function ReadFile(targetPath: string): Promise<string>;
export declare function MKDir(name: string, callback: Function): Promise<void>;
