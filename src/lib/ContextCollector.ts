import { readFile, access, readdir } from 'node:fs/promises';
import { join, isAbsolute, normalize, resolve } from 'node:path';
import matter from 'gray-matter';

interface Component {
  name: string;
  description: string;
}

interface Pattern {
  name: string;
  usage: string;
}

interface Architecture {
  style: string;
  components: Component[];
  patterns: Pattern[];
}

interface Development {
  setup?: string[];
  testing?: {
    framework?: string;
    coverage?: string;
  };
  deployment?: {
    platform?: string;
    pipeline?: string;
  };
  [key: string]: any;
}

interface Metadata {
  'module-name': string;
  version?: string;
  description: string;
  technologies?: string[];
  conventions?: string[];
  architecture: Architecture;
  development?: Development;
  'business-requirements'?: string[];
  permissions?: {
    'allow-ai-modifications'?: boolean;
    [key: string]: any;
  };
  [key: string]: any;
}

interface RelatedModule {
  name: string;
  path: string;
  error?: string;
}

export interface CollectedContext {
  metadata: Metadata;
  relatedModules: RelatedModule[];
  diagrams: Record<string, string>;
  unstructured: string;
  _debug?: {
    path?: string;
  };
}

export class ContextCollector {
  private baseDir: string;

  constructor(baseDir: string = process.cwd()) {
    this.baseDir = normalize(resolve(baseDir));
    console.error('ContextCollector baseDir:', this.baseDir);
  }

  private resolvePath(dirPath: string): string {
    const resolved = isAbsolute(dirPath) ? normalize(dirPath) : normalize(resolve(this.baseDir, dirPath));
    console.error('ContextCollector resolving path:', { dirPath, baseDir: this.baseDir, resolved });
    return resolved;
  }

  private parseComponents(data: any): Component[] {
    if (!Array.isArray(data)) return [];
    
    return data.map(comp => {
      if (typeof comp === 'string') {
        return { name: comp, description: '' };
      }
      if (typeof comp === 'object' && comp !== null) {
        return {
          name: comp.Name || comp.name || '',
          description: comp.Description || comp.description || ''
        };
      }
      return { name: '', description: '' };
    });
  }

  private parsePatterns(data: any): Pattern[] {
    if (!Array.isArray(data)) return [];
    
    return data.map(pattern => {
      if (typeof pattern === 'object' && pattern !== null) {
        return {
          name: pattern.Name || pattern.name || '',
          usage: pattern.Usage || pattern.usage || ''
        };
      }
      return { name: '', usage: '' };
    });
  }

  async validateContextStructure(dirPath: string): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];
    const fullPath = this.resolvePath(dirPath);

    try {
      // Check if directory exists
      await access(fullPath);

      // Check for index.md
      const indexPath = join(fullPath, 'index.md');
      try {
        await access(indexPath);
      } catch {
        errors.push('Missing index.md file');
      }


    } catch (error) {
      errors.push(`Invalid context directory: ${error instanceof Error ? error.message : String(error)}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  async collect(dirPath: string): Promise<CollectedContext> {
    const fullPath = this.resolvePath(dirPath);
    const indexFilePath = join(fullPath, 'index.md');

    console.error('ContextCollector collecting from:', { dirPath, fullPath, indexFilePath });

    // Verify file exists
    try {
      await access(indexFilePath);
    } catch (error) {
      throw new Error(`Could not access index.md at path: ${indexFilePath}`);
    }

    // Read and parse file
    let fileContent: string;
    try {
      fileContent = await readFile(indexFilePath, 'utf-8');
      console.error('ContextCollector read file content length:', fileContent.length);
    } catch (error) {
      throw new Error(`Failed to read index.md at path: ${indexFilePath}`);
    }

    // Parse frontmatter
    let parsed;
    try {
      parsed = matter(fileContent);
      console.error('ContextCollector parsed frontmatter:', parsed.data);
    } catch (error) {
      throw new Error(`Failed to parse frontmatter in index.md: ${error}`);
    }

    // Create metadata object using only the actual frontmatter data
    const metadata: Metadata = {
      'module-name': parsed.data['module-name'],
      description: parsed.data.description,
      architecture: {
        style: parsed.data.architecture?.style || '',
        components: this.parseComponents(parsed.data.architecture?.components),
        patterns: this.parsePatterns(parsed.data.architecture?.patterns)
      }
    };

    // Add optional fields only if they exist in frontmatter
    if (parsed.data.version) metadata.version = parsed.data.version;
    if (parsed.data.technologies) metadata.technologies = parsed.data.technologies;
    if (parsed.data.conventions) metadata.conventions = parsed.data.conventions;
    if (parsed.data.development) metadata.development = parsed.data.development;
    if (parsed.data['business-requirements']) metadata['business-requirements'] = parsed.data['business-requirements'];
    if (parsed.data.permissions) metadata.permissions = parsed.data.permissions;

    // Get diagrams
    const diagrams = await this.getDiagrams(dirPath);
    const diagramsContent: Record<string, string> = {};
    
    for (const diagram of diagrams) {
      try {
        const content = await readFile(join(fullPath, 'diagrams', diagram), 'utf-8');
        diagramsContent[diagram] = content;
      } catch (error) {
        console.error(`Failed to read diagram ${diagram}:`, error);
      }
    }

    // Return the exact content from the file
    return {
      metadata,
      relatedModules: [],
      diagrams: diagramsContent,
      unstructured: parsed.content,
      _debug: {
        path: indexFilePath
      }
    };
  }

  async getDiagrams(dirPath: string): Promise<string[]> {
    try {
      const fullPath = this.resolvePath(dirPath);
      const diagramsPath = join(fullPath, 'diagrams');
      
      try {
        await access(diagramsPath);
      } catch {
        return [];
      }
      
      const allFiles = await readdir(diagramsPath);
      
      // Filter for .mmd files
      return allFiles.filter(file => file.endsWith('.mmd'));
      
    } catch {
      return [];
    }
  }
}
