import { execSync } from 'child_process';
import path from 'path';
import { removeGitFolder, replaceInFiles } from '../utils/file-utils';
import { logError, logInfo, logSuccess } from '../utils/logger';

export async function createMicroservice(options: { name: string; port: string; token: string }) {
  const { name, port, token } = options;
  const targetDir = `ms-${name}`;
  const repoUrl = `https://${token}@github.com/adancaymdev/nestjs-microservice-template.git`;

  try {
    logInfo('Clonando el template...');
    execSync(`git clone ${repoUrl} ${targetDir}`, { stdio: 'inherit' });

    logInfo('Eliminando carpeta .git...');
    await removeGitFolder(path.join(targetDir, '.git'));

    logInfo('Reemplazando placeholders...');
    await replaceInFiles(targetDir, {
      '__name__': name,
      '__port__': port,
    });

    logInfo('Instalando dependencias...');
    execSync('yarn install', { cwd: path.resolve(targetDir), stdio: 'inherit' });

    logSuccess(`Microservicio "ms-${name}" creado exitosamente.`);
    console.log(`👉 cd ${targetDir}`);
    console.log(`👉 yarn start:dev`);
  } catch (error) {
    logError('Error al crear el microservicio');
    console.error((error as any).message);
    process.exit(1);
  }
}