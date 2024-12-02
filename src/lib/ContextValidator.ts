import * as fs from 'fs/promises';
import * as path from 'path';

export class ContextValidator {
  private readonly contextDir = '.context';
  private readonly requiredFiles = ['index.md'];

  async validateContext(): Promise<boolean> {
    try {
      // Check if .context directory exists
      await fs.access(this.contextDir);
      
      // Validate required files
      for (const file of this.requiredFiles) {
        const filePath = path.join(this.contextDir, file);
        await fs.access(filePath);
        
        // Read and validate index.md content
        if (file === 'index.md') {
          const content = await fs.readFile(filePath, 'utf-8');
          if (!this.validateIndexContent(content)) {
            console.error('❌ index.md format is invalid');
            return false;
          }
        }
      }

      return true;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`❌ Validation error: ${error.message}`);
      }
      return false;
    }
  }

  private validateIndexContent(content: string): boolean {
    // Basic validation of index.md content
    const requiredFields = [
      'module-name:',
      'version:',
      'description:'
    ];

    return requiredFields.every(field => 
      content.toLowerCase().includes(field.toLowerCase())
    );
  }
}
