# Contributing to dotcontext

## MCP Server Configuration

The dotcontext MCP server can be configured in two ways depending on whether you're developing locally or using the published package.

### Development Configuration

When developing locally, follow these steps:

1. First, run `npm run build` to generate the dist files. This compiles TypeScript files to JavaScript in the dist directory.

2. Configure your MCP settings file. The file is typically located at:
   - Windows: `%APPDATA%/Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json`
   - macOS: `~/Library/Application Support/Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json`

3. Use this configuration, replacing the paths with your actual full paths:

```json
{
  "mcpServers": {
    "dotcontext": {
      "command": "node",
      "args": ["C:/full/path/to/your/project/dist/mcp.js"],
      "env": {
        "NODE_ENV": "development"
      },
      "disabled": false,
      "alwaysAllow": []
    }
  }
}
```

IMPORTANT: Always use:
- Full absolute paths (no relative paths)
- Forward slashes (/) even on Windows
- The correct path to your local development directory

### Production Configuration

For production use (after the package is published to npm), use this configuration:

```json
{
  "mcpServers": {
    "dotcontext": {
      "command": "npx",
      "args": ["-y", "dotcontext", "mcp"],
      "disabled": false,
      "alwaysAllow": []
    }
  }
}
```

This configuration uses npx to run the latest published version of the package.

## Development Setup

1. Clone the repository
2. Install dependencies with `npm install`
3. Build the project with `npm run build`
4. Configure your MCP settings using the development configuration above
5. Run tests with `npm test`
6. Start development with `npm run dev`

## Testing Your MCP Server

You can test your MCP server implementation using the MCP inspector:

```bash
npm run inspector
```

This will validate your MCP server implementation and show available tools and resources.