import { ContextGenerator } from '../lib/ContextGenerator';

export const init = async () => {
  try {
    const generator = new ContextGenerator();
    
    // Generate both context directory and ignore file by default
    await generator.generateContextDir();
    await generator.generateIgnoreFile();
    
    console.log('✅ Initialized .context directory with default structure');
    console.log('✅ Generated .contextignore file with default patterns');
    
    process.exit(0);
  } catch (error) {
    console.error('Error during initialization:', error);
    process.exit(1);
  }
};
