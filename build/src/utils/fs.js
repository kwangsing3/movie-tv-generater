"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadFile = exports.MKDir = exports.WriteFile = void 0;
const fs = require("fs");
const path_1 = require("path");
const path_2 = require("path");
async function WriteFile(targetPath, content) {
    await MKDir((0, path_2.dirname)(targetPath)).then(() => {
        targetPath = (0, path_1.join)(targetPath);
        const splitPath = targetPath.split((0, path_1.join)('/'));
        let finalPath = '';
        splitPath.forEach(element => {
            element = element.replace(/[/\\?%*:|"<>]/g, '-');
            finalPath += (0, path_1.join)('/') + element;
        });
        fs.writeFile((0, path_1.join)('.' + finalPath), content, err => {
            if (err) {
                console.error('/n' + err.message);
            }
        });
    });
}
exports.WriteFile = WriteFile;
async function MKDir(name) {
    if (name === '')
        return;
    name = (0, path_1.join)(name);
    const splitPath = name.split((0, path_1.join)('/'));
    let finalPath = './';
    splitPath.forEach(element => {
        element = element.replace(/[/\\?%*:|"<>]/g, '-');
        finalPath += element + '/';
    });
    fs.mkdir((0, path_1.join)(finalPath), { recursive: true }, err => {
        if (err)
            return console.error('/n' + err);
    });
}
exports.MKDir = MKDir;
async function ReadFile(targetPath) {
    return new Promise(resolve => {
        fs.readFile(targetPath, (err, data) => {
            if (err)
                throw err;
            resolve(String(data));
        });
    });
}
exports.ReadFile = ReadFile;
//# sourceMappingURL=fs.js.map