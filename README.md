# dotcontext

A convention developers can all easily adopt to capture and communicate the context of your codebase for both AI coding agents and humans. Similar to .env and .editorconfig, but focused on documenting your code. Visit [codebasecontext.org](https://codebasecontext.org/) to learn more about the specification.

## Overview

This package provides a comprehensive system for managing and leveraging codebase context through two main components:

1. **CLI Tool (`dotcontext`)**: A command-line interface that helps developers:
   - Initialize and structure context documentation
   - Validate context files against the CCS specification
   - Generate and manage architectural diagrams
   - Maintain consistent documentation standards
   - Lint context files for best practices

2. **MCP Server (`dotcontext-mcp`)**: An integration layer that enables AI tools to understand your codebase by:
   - Providing programmatic access to context information
   - Exposing architectural diagrams and documentation
   - Enabling automated context validation
   - Supporting tools like [Cline](https://codebasecontext.org/tools/code-generation/cline) in making informed decisions about your code

Together, these components create a bridge between human-readable documentation and machine-interpretable context, making your codebase more accessible to both developers and AI tools.
![Codebase Context](https://raw.githubusercontent.com/Agentic-Insights/codebase-context-spec/main/img/codebase-context.png)

## Usage

### CLI Quick Start

The CLI tool provides direct command-line access to context management features:

```bash
# Initialize a new context directory
npx dotcontext init

# Validate your context structure
npx dotcontext validate

# View available diagrams
npx dotcontext diagrams --content
```

### MCP Integration

Enable AI tools to understand your codebase by adding the MCP server to your client's configuration:

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

For Windows users experiencing 'spawn NOENT' errors in Cline, use this configuration:

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

The MCP server provides tools for AI agents to:
- Read and parse your context documentation
- Access architectural diagrams
- Validate context structure
- Extract project metadata

All tools automatically use the `.context` directory in your project root unless specified otherwise.

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

