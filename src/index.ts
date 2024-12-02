#!/usr/bin/env node

import { Command } from 'commander';
import { validate } from './commands/validate';
import { generate } from './commands/generate';
import { lint } from './commands/lint';

const program = new Command();

program
  .name('cc-linter')
  .description('CLI tool for managing and validating codebase context specifications')
  .version('0.1.0');

program
  .command('validate')
  .description('Validate .context directory against CCS spec')
  .action(validate);

program
  .command('generate')
  .description('Generate new context files or directories')
  .option('-t, --type <type>', 'Type of content to generate (context|ignore)', 'context')
  .action(generate);

program
  .command('lint')
  .description('Lint context files for compliance and best practices')
  .option('--fix', 'Automatically fix linting issues when possible')
  .action(lint);

program.parse();
