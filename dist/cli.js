#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const create_microservice_1 = require("./commands/create-microservice");
const interactive_mode_1 = require("./commands/interactive-mode");
const program = new commander_1.Command();
program
    .name('setup-microservice')
    .description('CLI para generar microservicios NestJS')
    .option('--name <name>', 'Nombre del microservicio')
    .option('--port <port>', 'Puerto del microservicio')
    .option('--token <token>', 'GitHub Personal Access Token')
    .option('--interactive', 'Modo interactivo para no usar flags')
    .action(async (options) => {
    if (options.interactive) {
        await (0, interactive_mode_1.interactiveMode)();
    }
    else {
        await (0, create_microservice_1.createMicroservice)(options);
    }
});
program.parseAsync(process.argv);
