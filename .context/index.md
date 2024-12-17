---
module-name: Codebase Context CLI
version: 0.1.0
description: MCP Server and a CLI tool for managing and validating dotcontext (.context) directories.
technologies:
  - MCP Server
  - Node.js
  - TypeScript
  - Commander.js
conventions:
  - Follow TypeScript best practices
  - Use Commander.js for CLI implementation
  - Implement semantic versioning
  - Write unit tests for all features
architecture:
  style: IDE Utilities via npx/npm
  components:
    - Content Collector - helps build a prompt from unstructured data in main module and submodules (core prompt generation functionality)
    - Context Generator - supports the init commands and generates a starter template (analagous to git init)
    - Context Validator
    - Context Linter
development:
  setup-steps:
    - Clone the repository
    - Install dependencies with `npm install`
    - Build with `npm run build`
    - Link locally with `npm link`
business-requirements:
  - Must provide an easy-to-use CLI interface
  - Should validate .context directories against the CCS spec
  - Must help developers create and maintain compliant context documentation
quality-assurance:
  - Testing framework: Jest
  - Code coverage target: 90%
deployment:
  - Platform: npm registry
  - CICD: GitHub Actions
permissions:
  allow-ai-modifications: true
---

# Codebase Context MCP & CLI

A command-line interface tool for managing and validating codebase context specifications. This tool helps developers implement the Codebase Context Specification (CCS) effectively by providing utilities for creation, validation, and maintenance of `.context` directories. It also provides your tools with an MCP server that lets them pull in the .context into your context window. T

## Key Features

- Create new `.context` directories with proper structure
- Validate existing `.context` directories against the CCS spec
- Generate `.contextignore` files with sensible defaults
- Lint context files for compliance and best practices

## Project Goals

1. Help save / use summaries and descriptions for your coding agent relevant to your repositories
2. Help standardize the implementation of the CCS across projects letting AI understand across repositories
3. Facilitate better documentation practices in development teams

## Architecture

Supports basic functions through CLI and MCP interfaces.

See the [architecture diagram](diagrams/architecture.mmd) for a visual representation of how the MCP server exposes tools that interact with the core components. The Context Manager acts as a central coordinator, leveraging the Validator and Linter as needed.

