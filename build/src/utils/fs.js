"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MKDir = exports.ReadFile = exports.WriteFileJSON = exports.WriteFile = void 0;
const fs = require("fs");
const path_1 = require("path");
const path_2 = require("path");
// WriteFile
function WriteFile(targetPath, content) {
    let parentPath = (0, path_2.dirname)(targetPath);
    MKDir(parentPath, () => {
        targetPath = (0, path_1.join)(targetPath);
        const splitPath = targetPath.split((0, path_1.join)('/'));
        let finalPath = '';
        splitPath.forEach(element => {
            element = element.replace(/[/\\?%*:|"<>]/g, '-');
            finalPath += (0, path_1.join)('/') + element;
        });
        fs.writeFile((0, path_1.join)('.' + finalPath), JSON.stringify(content), err => {
            if (err) {
                let debugPath = targetPath;
                console.error(`ParentPath: ${debugPath}` + err.message);
            }
        });
    });
}
exports.WriteFile = WriteFile;
function WriteFileJSON(targetPath, content) {
    let parentPath = (0, path_2.dirname)(targetPath);
    MKDir(parentPath, () => {
        targetPath = (0, path_1.join)(targetPath);
        const splitPath = targetPath.split((0, path_1.join)('/'));
        let finalPath = '';
        splitPath.forEach(element => {
            element = element.replace(/[/\\?%*:|"<>]/g, '-');
            finalPath += (0, path_1.join)('/') + element;
        });
        fs.writeFile((0, path_1.join)('.' + finalPath), JSON.stringify(content, null, 4), err => {
            if (err) {
                let debugPath = targetPath;
                console.error(`ParentPath: ${debugPath}` + err.message);
            }
        });
    });
}
exports.WriteFileJSON = WriteFileJSON;
// ReadFile
function ReadFile(targetPath) {
    return new Promise(resolve => {
        fs.readFile(targetPath, (err, data) => {
            if (err)
                throw err;
            resolve(JSON.stringify(data));
        });
    });
}
exports.ReadFile = ReadFile;
// Make Folder with recursive
async function MKDir(name, callback) {
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
        if (err) {
            console.error('/n' + err);
        }
        callback();
    });
}
exports.MKDir = MKDir;
//# sourceMappingURL=fs.js.map