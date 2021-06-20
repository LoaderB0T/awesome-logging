import chalk from 'chalk';
import { StringRenderer } from './render/string-renderer';

console.log();
console.log();
console.log();
console.log();
console.log();
console.log('--');

StringRenderer.renderString(chalk.red('yee') + chalk.yellow(' yaaas\nnext line\neven one more'));
StringRenderer.renderString(chalk.red('yee') + chalk.yellow(' yaaas\nnext line\neven one more'));
StringRenderer.renderString(chalk.red('yee') + chalk.green(' yaaas\nnext line\neven one more'));
StringRenderer.renderString(chalk.red('yee') + chalk.yellow(' yaaas\nnext line\neven one more'));
StringRenderer.renderString(chalk.red('yee') + chalk.yellow(' yaaas\nnext line\neven one more'));
StringRenderer.renderString(chalk.red('yee') + chalk.yellow(' yeees\nnext line\n\neven one more'));
StringRenderer.renderString(chalk.red('yee') + chalk.yellow(' yeees\nnext line\neven one more'));
StringRenderer.renderString(chalk.red('yee') + chalk.yellow(' yeees\nnext line\neven \none \nmore'));
StringRenderer.renderString(chalk.red('awdawd\nsecondline') + chalk.yellow(' awdawdawd'));
