import { ContextGenerator } from '../lib/ContextGenerator';

export const init = async () => {
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
};
