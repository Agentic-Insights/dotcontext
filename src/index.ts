#!/usr/bin/env node

import { Command } from 'commander';
import { validate } from './commands/validate';
import { init } from './commands/init';
import { lint } from './commands/lint';

const program = new Command();

program
  .name('dotcontext')
  .description('CLI tool for managing and validating codebase context specifications')
  .version('0.1.0');

program
  .command('validate')
  .description('Validate .context directory against CCS spec')
  .action(validate);

program
  .command('init')
  .description('Initialize new context directory and ignore file')
  .action(init);

program
  .command('lint')
  .description('Lint context files for compliance and best practices')
  .option('--fix', 'Automatically fix linting issues when possible')
  .action(lint);

program.parse();
