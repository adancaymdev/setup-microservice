#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const commander_1 = require("commander");
const fs_1 = require("fs");
const path = __importStar(require("path"));
// CLI
const program = new commander_1.Command();
program
    .requiredOption('--name <name>', 'Nombre del microservicio')
    .requiredOption('--port <port>', 'Puerto del microservicio')
    .requiredOption('--token <token>', 'GitHub Personal Access Token')
    .parse(process.argv);
const options = program.opts();
const serviceName = options.name;
const servicePort = options.port;
const githubToken = options.token;
const repoUrl = `https://${githubToken}@github.com/adancaymdev/nestjs-microservice-template.git`;
const targetDir = `ms-${serviceName}`;
async function replaceInFile(filePath, replacements) {
    const data = await fs_1.promises.readFile(filePath, 'utf8');
    let updated = data;
    for (const [placeholder, value] of Object.entries(replacements)) {
        const regex = new RegExp(placeholder, 'g');
        updated = updated.replace(regex, value);
    }
    await fs_1.promises.writeFile(filePath, updated, 'utf8');
}
async function walk(dir) {
    const entries = await fs_1.promises.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(entries.map(entry => {
        const res = path.resolve(dir, entry.name);
        return entry.isDirectory() ? walk(res) : Promise.resolve([res]);
    }));
    return Array.prototype.concat(...files);
}
async function setupMicroservice() {
    console.log('🚀 Clonando el template con git clone...');
    (0, child_process_1.execSync)(`git clone ${repoUrl} ${targetDir}`, { stdio: 'inherit' });
    console.log('🧹 Eliminando .git para limpiar el proyecto...');
    await fs_1.promises.rm(path.join(targetDir, '.git'), { recursive: true, force: true });
    console.log('✍️ Reemplazando placeholders...');
    const replacements = {
        '__name__': serviceName,
        '__port__': servicePort,
    };
    const files = await walk(targetDir);
    const tsFiles = files.filter(file => file.endsWith('.ts') || file.endsWith('.json'));
    for (const file of tsFiles) {
        await replaceInFile(file, replacements);
    }
    console.log('📦 Instalando dependencias...');
    (0, child_process_1.execSync)('yarn install', { cwd: path.resolve(targetDir), stdio: 'inherit' });
    console.log(`✅ Microservicio "ms-${serviceName}" creado exitosamente!`);
    console.log(`👉 cd ${targetDir}`);
    console.log('👉 yarn start:dev');
}
setupMicroservice().catch((error) => {
    console.error('❌ Error:', (error).message);
    process.exit(1);
});
