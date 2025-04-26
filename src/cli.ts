#!/usr/bin/env node

import { Command } from 'commander';
import { createMicroservice } from './commands/create-microservice';
import { interactiveMode } from './commands/interactive-mode';

const program = new Command();

program
  .name('setup-microservice')
  .description('CLI para generar microservicios NestJS')
  .option('--name <name>', 'Nombre del microservicio')
  .option('--port <port>', 'Puerto del microservicio')
  .option('--token <token>', 'GitHub Personal Access Token')
  .option('--interactive', 'Modo interactivo para no usar flags')
  .action(async (options) => {
    if (options.interactive) {
      await interactiveMode();
    } else {
      await createMicroservice(options);
    }
  });

program.parseAsync(process.argv);