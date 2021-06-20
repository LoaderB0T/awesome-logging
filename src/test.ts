import chalk from 'chalk';
import { AwesomeLogger } from './awesome-logger';

// AwesomeLogger.log('text', { text: chalk.red('yee') + chalk.yellow(' yaaas\nnext line\neven one more') });
// AwesomeLogger.log('text', { text: chalk.red('yee') + chalk.yellow(' yaaas\nnext line\neven one more') });
// AwesomeLogger.log('text', { text: chalk.red('yee') + chalk.green(' yaaas\nnext line\neven one more') });
// AwesomeLogger.log('text', { text: chalk.red('yee') + chalk.yellow(' yaaas\nnext line\neven one more') });
// AwesomeLogger.log('text', { text: chalk.red('yee') + chalk.yellow(' yaaas\nnext line\neven one more') });
// AwesomeLogger.log('text', { text: chalk.red('yee') + chalk.yellow(' yeees\nnext line\n\neven one more') });
// AwesomeLogger.log('text', { text: chalk.red('yee') + chalk.yellow(' yeees\nnext line\neven one more') });
// AwesomeLogger.log('text', { text: chalk.red('yee') + chalk.yellow(' yeees\nnext line\neven \none \nmore') });
// AwesomeLogger.log('text', { text: chalk.red('awdawd\nsecondline') + chalk.yellow(' awdawdawd') });

const ctrl = AwesomeLogger.log('text', { text: chalk.red('yee') });
ctrl.setText('nope');
