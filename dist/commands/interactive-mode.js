"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.interactiveMode = interactiveMode;
const inquirer_1 = __importDefault(require("inquirer"));
const create_microservice_1 = require("./create-microservice");
async function interactiveMode() {
    const answers = await inquirer_1.default.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Nombre del microservicio:',
            validate: (input) => !!input || 'El nombre es obligatorio',
        },
        {
            type: 'input',
            name: 'port',
            message: 'Puerto del microservicio:',
            validate: (input) => /^\d+$/.test(input) || 'Debe ser un número válido',
        },
        {
            type: 'password',
            name: 'token',
            message: 'GitHub Personal Access Token:',
            mask: '*',
            validate: (input) => !!input || 'El token es obligatorio',
        },
    ]);
    await (0, create_microservice_1.createMicroservice)(answers);
}
