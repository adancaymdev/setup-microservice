import inquirer from 'inquirer';
import { createMicroservice } from './create-microservice';

export async function interactiveMode() {
  const answers = await inquirer.prompt([
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

  await createMicroservice(answers);
}