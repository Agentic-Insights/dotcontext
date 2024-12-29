---
# Basic project information
module-name: dotcontext
version: 1.3.6
description: A tool for providing AI coding agents with structured project context

# Technical stack
technologies:
  - Node.js
  - TypeScript
  - Model Context Protocol (MCP)

# Development conventions
conventions:
  - ESLint + Prettier
  - Conventional Commits
  - Semantic Release

# Architecture details
architecture:
  style: CLI Tool + MCP Server
  components:
    - name: CLI Interface
      description: Provides command-line tools for managing context
    - name: MCP Server
      description: Exposes context functionality to AI assistants
    - name: Context Generator
      description: Creates and manages context directory structure
  patterns:
    - name: Command Pattern
      usage: CLI command organization
    - name: MCP Protocol
      usage: Standardized AI communication

# Development information
development:
  setup:
    - npm install
    - npm run build
    - npm link (for local development)
  testing:
    framework: Jest
    coverage: Comprehensive test coverage
  deployment:
    platform: npm package
    pipeline: GitHub Actions

# Business context
business-requirements:
  - Standardized project context for AI tools
  - Easy integration with AI coding agents
  - Maintainable documentation structure

# Quality assurance
quality-assurance:
  testing-strategy:
    - Unit tests with Jest
    - Integration tests for MCP server
    - CLI command testing
  code-quality:
    - TypeScript for type safety
    - Automated versioning
    - Modular architecture

# AI tool configuration
permissions:
  allow-ai-modifications: true
---

# Project Documentation

## Overview

dotcontext is a tool designed to help AI coding agents better understand project context through a standardized documentation structure. It emerged from the common pattern of developers sharing README files with AI assistants to help them understand projects before starting tasks.

## Architecture Details

### Component Interactions

The project consists of several key components:

1. CLI Interface
   - Provides commands for managing context
   - Handles initialization and validation

2. MCP Server
   - Implements Model Context Protocol
   - Exposes context functionality to AI tools
   - Handles context queries and updates

3. Context Generator
   - Creates standardized directory structure
   - Manages documentation templates
   - Handles context file generation

### Design Decisions

- **TypeScript**: Chosen for type safety and better development experience
- **MCP Protocol**: Standardizes communication between AI tools and context
- **Modular Architecture**: Separates concerns between CLI, server, and generation
- **File-based Storage**: Simple, git-friendly documentation storage

