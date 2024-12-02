import * as fs from 'fs/promises';
import * as path from 'path';
import { ContextGenerator } from '../lib/ContextGenerator';

interface GenerateOptions {
  type: 'context' | 'ignore';
}

export const generate = async (options: GenerateOptions) => {
  try {
    const generator = new ContextGenerator();
    
    if (options.type === 'context') {
      await generator.generateContextDir();
      console.log('✅ Generated .context directory with default structure');
    } else if (options.type === 'ignore') {
      await generator.generateIgnoreFile();
      console.log('✅ Generated .contextignore file with default patterns');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error during generation:', error);
    process.exit(1);
  }
};
