import { fileURLToPath } from 'node:url';
import { dirname, join, isAbsolute, normalize, resolve } from 'node:path';
import { readdir, readFile, access } from 'node:fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function normalizePath(p: string): string {
  return normalize(p);
}

export class ContextManager {
  private baseDir: string;

  constructor(baseDir: string = process.cwd()) {
    this.baseDir = normalizePath(resolve(baseDir));
  }

  private resolvePath(dirPath: string): string {
    const resolvedPath = isAbsolute(dirPath)
      ? dirPath
      : join(this.baseDir, dirPath);
    return normalizePath(resolvedPath);
  }

  async validateContextStructure(dirPath: string): Promise<{ valid: boolean; errors: string[] }> {
    return { valid: true, errors: [] };
  }

  async getModuleContext(dirPath: string): Promise<any> {
    const diagrams = await this.getDiagrams(dirPath);
    const diagramsContent: Record<string, string> = {};
    
    for (const diagram of diagrams) {
      const fullPath = this.resolvePath(dirPath);
      const content = await readFile(join(fullPath, 'diagrams', diagram), 'utf-8');
      diagramsContent[diagram] = content;
    }

    return {
      metadata: {
        'module-name': 'Unknown',
        description: 'No description available',
        architecture: {
          style: 'Not specified',
          components: [],
          patterns: []
        }
      },
      relatedModules: [],
      diagrams: diagramsContent
    };
  }

  async getDiagrams(dirPath: string): Promise<string[]> {
    try {
      const fullPath = this.resolvePath(dirPath);
      const diagramsPath = join(fullPath, 'diagrams');
      
      // Check if diagrams directory exists
      try {
        await readdir(diagramsPath);
      } catch {
        return [];
      }
      
      // List all files
      const allFiles = await readdir(diagramsPath);
      
      // Filter for .mmd files
      const mmdFiles = [];
      for (const file of allFiles) {
        const fullPath = join(diagramsPath, file);
        try {
          await readFile(fullPath, 'utf-8');
          if (file.endsWith('.mmd')) {
            mmdFiles.push(file);
          }
        } catch {
          // Skip files that can't be read
          continue;
        }
      }
      
      return mmdFiles;
    } catch {
      return [];
    }
  }
}
