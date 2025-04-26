import chalk from 'chalk';

export function logSuccess(message: string) {
  console.log(chalk.green(`✅ ${message}`));
}

export function logInfo(message: string) {
  console.log(chalk.blue(`ℹ️  ${message}`));
}

export function logError(message: string) {
  console.log(chalk.red(`❌ ${message}`));
}