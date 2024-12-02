import * as fs from 'fs/promises';
import * as path from 'path';

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

# IDE and editor files
.vscode/
.idea/
*.swp
*.swo

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

# Test coverage
coverage/
.nyc_output/

# Temporary files
tmp/
temp/`;

  async generateContextDir(): Promise<void> {
    try {
      // Create .context directory if it doesn't exist
      await fs.mkdir(this.contextDir, { recursive: true });
      
      // Create index.md with default content
      const indexPath = path.join(this.contextDir, 'index.md');
      await fs.writeFile(indexPath, this.defaultIndexContent);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate context directory: ${error.message}`);
      }
      throw error;
    }
  }

  async generateIgnoreFile(): Promise<void> {
    try {
      // Create .contextignore with default patterns
      await fs.writeFile('.contextignore', this.defaultIgnoreContent);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate ignore file: ${error.message}`);
      }
      throw error;
    }
  }
}
