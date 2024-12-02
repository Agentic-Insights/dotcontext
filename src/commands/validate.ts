import { ContextValidator } from '../lib/ContextValidator';

export const validate = async () => {
  try {
    const validator = new ContextValidator();
    const isValid = await validator.validateContext();
    
    if (isValid) {
      console.log('✅ Context directory is valid according to CCS spec');
      process.exit(0);
    } else {
      console.error('❌ Context directory validation failed');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error during validation:', error);
    process.exit(1);
  }
};
