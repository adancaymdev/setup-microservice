"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.walk = walk;
exports.replaceInFiles = replaceInFiles;
exports.removeGitFolder = removeGitFolder;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
async function walk(dir) {
    const entries = await fs_1.promises.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(entries.map((entry) => {
        const res = path_1.default.resolve(dir, entry.name);
        return entry.isDirectory() ? walk(res) : Promise.resolve([res]);
    }));
    return Array.prototype.concat(...files);
}
async function replaceInFiles(dir, replacements) {
    const files = await walk(dir);
    const tsFiles = files.filter((file) => file.endsWith('.ts') || file.endsWith('.json'));
    for (const file of tsFiles) {
        let content = await fs_1.promises.readFile(file, 'utf8');
        for (const [placeholder, value] of Object.entries(replacements)) {
            const regex = new RegExp(placeholder, 'g');
            content = content.replace(regex, value);
        }
        await fs_1.promises.writeFile(file, content, 'utf8');
    }
}
async function removeGitFolder(gitPath) {
    await fs_1.promises.rm(gitPath, { recursive: true, force: true });
}
