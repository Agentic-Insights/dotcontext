#!/usr/bin/env node
import { Command } from 'commander';
import { ContextManager } from './core.js';
import path from 'path';
import { ContextGenerator } from './lib/ContextGenerator';

const program = new Command();
const contextManager = new ContextManager();

program
  .name('dotcontext')
  .description('CLI tool for working with the Codebase Context Specification')
  .version('1.0.0');

program
  .command('validate')
  .description('Validate a .context directory structure and contents')
  .argument('<path>', 'Path to the .context directory')
  .action(async (dirPath: string) => {
    try {
      const absolutePath = path.resolve(process.cwd(), dirPath);
      const result = await contextManager.validateContextStructure(absolutePath);
      
      if (result.valid) {
        console.log('✅ Context directory is valid');
      } else {
        console.error('❌ Context directory validation failed:');
        result.errors.forEach((error: string) => console.error(`  - ${error}`));
        process.exit(1);
      }
    } catch (error: any) {
      console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });

program
  .command('context')
  .description('Get context information from index.md including related modules')
  .argument('<path>', 'Path to the .context directory')
  .option('-r, --raw', 'Output raw JSON instead of formatted text')
  .action(async (dirPath: string, options) => {
    try {
      const absolutePath = path.resolve(process.cwd(), dirPath);
      const context = await contextManager.getModuleContext(absolutePath);
      
      if (options.raw) {
        console.log(JSON.stringify(context, null, 2));
      } else {
        console.log(`\n📖 Module: ${context.metadata['module-name']}`);
        console.log(`\nDescription: ${context.metadata.description}`);
        
        console.log('\n🏗️  Architecture:');
        console.log(`Style: ${context.metadata.architecture.style}`);
        
        console.log('\nComponents:');
        context.metadata.architecture.components.forEach((comp: any) => {
          console.log(`  - ${comp.name}: ${comp.description}`);
        });
        
        console.log('\nPatterns:');
        context.metadata.architecture.patterns.forEach((pattern: any) => {
          console.log(`  - ${pattern.name}: ${pattern.usage}`);
        });
        
        if (context.relatedModules.length > 0) {
          console.log('\n🔗 Related Modules:');
          context.relatedModules.forEach((module: any) => {
            console.log(`  - ${module.name} (${module.path})`);
            if (module.error) {
              console.log(`    ⚠️  Error: ${module.error}`);
            }
          });
        }
        
        if (Object.keys(context.diagrams).length > 0) {
          console.log('\n📊 Diagrams:');
          Object.keys(context.diagrams).forEach(diagram => {
            console.log(`  - ${diagram}`);
          });
        }
      }
    } catch (error: any) {
      console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });

program
  .command('diagrams')
  .description('List available Mermaid diagrams')
  .argument('<path>', 'Path to the .context directory')
  .option('-c, --content', 'Include diagram content')
  .action(async (dirPath: string, options) => {
    try {
      const absolutePath = path.resolve(process.cwd(), dirPath);
      const diagrams = await contextManager.getDiagrams(absolutePath);
      
      if (diagrams.length === 0) {
        console.log('No diagrams found');
        return;
      }

      console.log('\n📊 Available diagrams:');
      for (const diagram of diagrams) {
        console.log(`  - ${diagram}`);
        if (options.content) {
          const context = await contextManager.getModuleContext(absolutePath);
          if (context.diagrams[diagram]) {
            console.log('\nContent:');
            console.log(context.diagrams[diagram]);
            console.log();
          }
        }
      }
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });

program
  .command('init')
  .description('Initialize new context directory and ignore file')
  .action(async () => {
    try {
      const generator = new ContextGenerator();
      const result = await generator.generate();
      
      if (!result.dirCreated && !result.indexCreated && !result.ignoreCreated) {
        console.log('✅ Context structure already exists');
      } else {
        if (result.dirCreated) {
          console.log('✅ Created .context directory');
        }
        if (result.indexCreated) {
          console.log('✅ Generated index.md with default content');
        }
        if (result.ignoreCreated) {
          console.log('✅ Generated .contextignore with default patterns');
        }
      }
      
      process.exit(0);
    } catch (error) {
      console.error('Error during initialization:', error);
      process.exit(1);
    }
  });

program.parse();