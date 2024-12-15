import * as fs from 'node:fs/promises';
import * as path from 'node:path';

export interface GenerationResult {
  dirCreated: boolean;
  indexCreated: boolean;
  ignoreCreated: boolean;
}

export class ContextGenerator {
  private readonly contextDir = '.context';
  private readonly defaultIndexContent = `\
module-name: Project Name
version: 0.1.0
description: Project description
technologies:
  - List your technologies here
conventions:
  - List your conventions here
architecture:
  style: Your architecture style
  components:
    - Component 1
    - Component 2
development:
  setup-steps:
    - Step 1
    - Step 2
business-requirements:
  - Requirement 1
  - Requirement 2
quality-assurance:
  - Testing framework: Your choice
  - Code coverage target: Your target
deployment:
  - Platform: Your platform
  - CICD: Your CI/CD solution
permissions:
  allow-ai-modifications: true
---

# Project Name

Detailed project description and documentation goes here.

## Key Features

- Feature 1
- Feature 2

## Project Goals

1. Goal 1
2. Goal 2

## Architecture

Describe your architecture here.

## Development Roadmap

1. Phase 1
2. Phase 2

## Contributing

Contribution guidelines go here.`;

  private readonly defaultIgnoreContent = `\
# Dependencies
node_modules/
vendor/

# Build outputs
dist/
build/
out/

# Operating System files
.DS_Store
Thumbs.db

# Logs and databases
*.log
*.sqlite

# Environment files
.env
.env.local
.env.*.local

# Temporary files
tmp/
temp/`;

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async generateContextDir(): Promise<boolean> {
    try {
      const dirExists = await this.fileExists(this.contextDir);
      if (!dirExists) {
        await fs.mkdir(this.contextDir, { recursive: true });
        return true;
      }
      return false;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate context directory: ${error.message}`);
      }
      throw error;
    }
  }

  async generateIndexFile(): Promise<boolean> {
    try {
      const indexPath = path.join(this.contextDir, 'index.md');
      const indexExists = await this.fileExists(indexPath);
      
      if (!indexExists) {
        await fs.writeFile(indexPath, this.defaultIndexContent);
        return true;
      }
      return false;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate index file: ${error.message}`);
      }
      throw error;
    }
  }

  async generateIgnoreFile(): Promise<boolean> {
    try {
      const ignoreExists = await this.fileExists('.contextignore');
      
      if (!ignoreExists) {
        await fs.writeFile('.contextignore', this.defaultIgnoreContent);
        return true;
      }
      return false;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate ignore file: ${error.message}`);
      }
      throw error;
    }
  }

  async generate(): Promise<GenerationResult> {
    const dirCreated = await this.generateContextDir();
    const indexCreated = await this.generateIndexFile();
    const ignoreCreated = await this.generateIgnoreFile();

    return {
      dirCreated,
      indexCreated,
      ignoreCreated
    };
  }
}
