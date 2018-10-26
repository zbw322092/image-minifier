import { config } from 'dotenv';
config();
import "reflect-metadata";
import App from './App';
import chalk from 'chalk';

const app = new App();

app.start().catch((err) => {
  return console.log(chalk.red.bold('Error: '), err);
});

process.on('uncaughtException', (err) => {
  console.log(chalk.red.bold('uncaughtException: '), err);
});