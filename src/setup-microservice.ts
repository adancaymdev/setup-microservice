#!/usr/bin/env node

import { execSync } from 'child_process';
import { Command } from 'commander';
import { promises as fs } from 'fs';
import * as path from 'path';

// CLI
const program = new Command();
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

async function replaceInFile(filePath: string, replacements: Record<string, string>) {
  const data = await fs.readFile(filePath, 'utf8');
  let updated = data;
  for (const [placeholder, value] of Object.entries(replacements)) {
    const regex = new RegExp(placeholder, 'g');
    updated = updated.replace(regex, value);
  }
  await fs.writeFile(filePath, updated, 'utf8');
}

async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(entry => {
      const res = path.resolve(dir, entry.name);
      return entry.isDirectory() ? walk(res) : Promise.resolve([res]);
    }),
  );
  return Array.prototype.concat(...files);
}

async function setupMicroservice() {
  console.log('🚀 Clonando el template con git clone...');

  execSync(`git clone ${repoUrl} ${targetDir}`, { stdio: 'inherit' });

  console.log('🧹 Eliminando .git para limpiar el proyecto...');
  await fs.rm(path.join(targetDir, '.git'), { recursive: true, force: true });

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
  execSync('yarn install', { cwd: path.resolve(targetDir), stdio: 'inherit' });

  console.log(`✅ Microservicio "ms-${serviceName}" creado exitosamente!`);
  console.log(`👉 cd ${targetDir}`);
  console.log('👉 yarn start:dev');
}

setupMicroservice().catch((error) => {
  console.error('❌ Error:', (error).message);
  process.exit(1);
});