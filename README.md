# dotcontext

A convention developers can all easily adopt to capture and communicate the context of your codebase for both AI coding agents and humans. Similar to .env and .editorconfig, but focused on documenting your code. Visit [codebasecontext.org](https://codebasecontext.org/) to learn more about the specification.

## Overview

This package provides two main components under a single npm package:

1. **CLI Tool (`dotcontext`)**: A command-line interface for managing your codebase context. Use this to initialize, validate, and maintain your `.context` directory structure:

   ```bash
   .context/
   ├── index.md     (required)
   ├── docs.md      (optional)
   ├── diagrams/    (optional)
   .contextignore (optional)
   ```

2. **MCP Server (`dotcontext-mcp`)**: A Model Context Protocol server that enables AI coding agents to interact with your codebase context. This allows tools like [Cline](https://codebasecontext.org/tools/code-generation/cline) to automatically read and understand your project's architecture and context.

Both components work together to help you maintain and leverage the [Codebase Context Specification (CCS)](https://github.com/Agentic-Insights/codebase-context-spec) in your projects.

![Codebase Context](https://raw.githubusercontent.com/Agentic-Insights/codebase-context-spec/main/img/codebase-context.png)

## Usage with an MCP client

Add this to your MCP client's configuration:

```json
{
  "mcpServers": {
    "dotcontext": {
      "command": "npx",
      "args": ["-y", "-p", "dotcontext", "dotcontext-mcp"],
      "disabled": false,
      "alwaysAllow": []
    }
  }
}
```

If you encounter 'spawn NOENT' errors on Windows when using Cline, modify the configuration to use the full path to npx:

```json
{
  "mcpServers": {
    "dotcontext": {
      "command": "node",
      "args": ["C:/Program Files/nodejs/node_modules/npm/bin/npx-cli.js", "-y", "-p", "dotcontext", "dotcontext-mcp"],
      "disabled": false,
      "alwaysAllow": []
    }
  }
}
```

The MCP server will automatically use the current working directory of your project.

## MCP Server Features

The MCP server provides the following tools:

### init
Initialize new context directory and ignore file
```json
{
  "path": "string (defaults to .context)"
}
```

### validate
Validate a .context directory structure and contents
```json
{
  "path": "string (defaults to .context)"
}
```

### context
Get context information from index.md including related modules
```json
{
  "path": "string (defaults to .context)",
  "raw": "boolean (optional, default: false)"
}
```

### diagrams
List available Mermaid diagrams
```json
{
  "path": "string (defaults to .context)",
  "content": "boolean (optional, default: false)"
}
```

All tools default to using `.context` in the current directory if no path is specified.

## CLI Usage

The package includes a CLI tool for manual interaction. You can run it using npx:

### Validate Context Directory

```bash
npx dotcontext validate [path]
```

### Initialize Context Directory

```bash
npx dotcontext init [path]
```

### List and View Diagrams

```bash
npx dotcontext diagrams [path]
npx dotcontext diagrams --content [path]
```

### Get Context Information

```bash
npx dotcontext context [path]
npx dotcontext context --raw [path]
```

### Lint Context Files

```bash
npx dotcontext lint [path]
npx dotcontext lint --fix [path]
```

## Learn More About CCS

- 📺 [Watch the CCS Introduction Video](https://youtu.be/g4YuNoLQ1zI)
- 📄 [Read the CCS RFC on SubStack](https://agenticinsights.substack.com/p/codebase-context-specification-rfc)
- 📚 [CCS GitHub Repository](https://github.com/Agentic-Insights/codebase-context-spec)

## Development

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```
4. Link for local development:
   ```bash
   npm link
   ```

### Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## Contributing

Contributions are welcome! Please ensure you follow our contribution guidelines and maintain test coverage for new features.

## License

MIT
