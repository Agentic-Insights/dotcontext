import * as fs from 'node:fs/promises';
import * as path from 'node:path';

export interface GenerationResult {
  dirCreated: boolean;
  indexCreated: boolean;
  ignoreCreated: boolean;
}

export class ContextGenerator {
  private readonly contextDir: string;
  
  constructor(contextDir: string = '.context') {
    this.contextDir = contextDir;
  }

  private readonly defaultIndexContent = `\
---
# Basic project information
module-name: Project Name
version: 0.1.0
description: A brief description of your project

# Technical stack
technologies:
  - Node.js
  - TypeScript
  - PostgreSQL

# Development conventions
conventions:
  - ESLint + Prettier
  - Conventional Commits
  - Git Flow

# Architecture details
architecture:
  style: Microservices
  components:
    - name: API Gateway
      description: Routes external requests to appropriate services
    - name: Auth Service
      description: Handles authentication and authorization
    - name: Core Service
      description: Manages core business logic
  patterns:
    - name: Repository Pattern
      usage: Data access abstraction in services
    - name: Circuit Breaker
      usage: Fault tolerance between services

# Development information
development:
  setup:
    - npm install
    - cp .env.example .env
    - npm run build
  testing:
    framework: Jest
    coverage: "80%"
  deployment:
    platform: AWS
    pipeline: GitHub Actions

# Business context
business-requirements:
  - Secure user authentication
  - High availability (99.9% uptime)
  - Real-time data synchronization

# AI tool configuration
permissions:
  allow-ai-modifications: true
---

# Project Documentation

## Overview

This section provides detailed documentation about the project's purpose,
functionality, and implementation details.

## Architecture Details

### Component Interactions

Describe how your components interact with each other. Consider adding
diagrams in the diagrams/ directory using Mermaid syntax.

### Design Decisions

Document important architectural decisions and their rationales:
- Why certain patterns were chosen
- Performance considerations
- Scalability approach

## Development Guide

### Getting Started

1. Clone the repository
2. Install dependencies (npm install)
3. Configure environment variables
4. Start development server

### Testing Strategy

- Unit tests for business logic
- Integration tests for API endpoints
- E2E tests for critical flows

### Deployment Process

- Automated CI/CD pipeline
- Staging environment validation
- Production deployment steps

## Contributing

### Guidelines

- Code style and formatting rules
- Pull request process
- Review requirements

### Common Tasks

- Adding new features
- Bug reporting process
- Documentation updates`;

  private readonly defaultIgnoreContent = `\
# Dependencies
node_modules/
vendor/

# Build outputs
dist/
build/
out/

# IDE and editor files
.idea/
.vscode/
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

# Temporary files
tmp/
temp/

# Test coverage
coverage/`;

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
        await fs.mkdir(path.join(this.contextDir, 'diagrams'), { recursive: true });
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
