"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMicroservice = createMicroservice;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const file_utils_1 = require("../utils/file-utils");
const logger_1 = require("../utils/logger");
async function createMicroservice(options) {
    const { name, port, token } = options;
    const targetDir = `ms-${name}`;
    const repoUrl = `https://${token}@github.com/adancaymdev/nestjs-microservice-template.git`;
    try {
        (0, logger_1.logInfo)('Clonando el template...');
        (0, child_process_1.execSync)(`git clone ${repoUrl} ${targetDir}`, { stdio: 'inherit' });
        (0, logger_1.logInfo)('Eliminando carpeta .git...');
        await (0, file_utils_1.removeGitFolder)(path_1.default.join(targetDir, '.git'));
        (0, logger_1.logInfo)('Reemplazando placeholders...');
        await (0, file_utils_1.replaceInFiles)(targetDir, {
            '__name__': name,
            '__port__': port,
        });
        (0, logger_1.logInfo)('Instalando dependencias...');
        (0, child_process_1.execSync)('yarn install', { cwd: path_1.default.resolve(targetDir), stdio: 'inherit' });
        (0, logger_1.logSuccess)(`Microservicio "ms-${name}" creado exitosamente.`);
        console.log(`👉 cd ${targetDir}`);
        console.log(`👉 yarn start:dev`);
    }
    catch (error) {
        (0, logger_1.logError)('Error al crear el microservicio');
        console.error(error.message);
        process.exit(1);
    }
}
