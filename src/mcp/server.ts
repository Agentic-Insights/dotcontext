import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { format } from 'util';
import { ContextManager } from '../core.js';
import { handleInit } from './handlers/init.js';
import { handleValidate } from './handlers/validate.js';
import { handleContext } from './handlers/context.js';
import { handleDiagrams } from './handlers/diagrams.js';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

export class DotContextServer {
  private server: Server;
  private contextManager: ContextManager;

  private log(level: string, message: string, context?: Record<string, unknown>) {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      message,
      ...context
    };
    console.error(format(logData));
  }

  constructor() {
    // Get the directory of the executed script
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    // Go up two directories from dist/mcp/server.js to get to the project root
    const projectRoot = resolve(__dirname, '..', '..');

    // Log initialization details
    this.log('info', 'Initializing server', {
      cwd: process.cwd(),
      dirname: __dirname,
      projectRoot,
      argv: process.argv
    });

    // Resolve and log package.json version
    const packageJsonPath = resolve(__dirname, '../../../package.json');
    const version = JSON.parse(readFileSync(packageJsonPath, 'utf-8')).version;
    this.log('info', 'Loaded package version', {
      packageJsonPath,
      version
    });

    this.server = new Server(
      {
        name: 'dotcontext',
        version: version,
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Use project root as base directory
    this.contextManager = new ContextManager(projectRoot);
    
    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error: Error) => {
      if (error instanceof McpError) {
        this.log('error', 'MCP Error occurred', {
          error: error.message,
          stack: error.stack
        });
      }
    };
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'init',
          description: 'Initialize new context directory and ignore file',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: 'Directory path where to initialize .context (defaults to .context in current directory)',
                default: '.context'
              },
            },
            required: ['path'],
          },
        },
        {
          name: 'validate',
          description: 'Validate a .context directory structure and contents',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: 'Path to the .context directory (defaults to .context in current directory)',
                default: '.context'
              },
            },
            required: ['path'],
          },
        },
        {
          name: 'context',
          description: 'Get context information from index.md including related modules',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: 'Path to the .context directory (defaults to .context in current directory)',
                default: '.context'
              },
              raw: {
                type: 'boolean',
                description: 'Output raw JSON instead of formatted text',
                default: false,
              },
            },
            required: ['path'],
          },
        },
        {
          name: 'diagrams',
          description: 'List available Mermaid diagrams',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: 'Path to the .context directory (defaults to .context in current directory)',
                default: '.context'
              },
              content: {
                type: 'boolean',
                description: 'Include diagram content',
                default: false,
              },
            },
            required: ['path'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name } = request.params;

        switch (name) {
        case 'init':
          return handleInit(request);
        case 'validate':
          return handleValidate(request);
        case 'context':
          return handleContext(request, this.contextManager);
        case 'diagrams':
          return handleDiagrams(request);
        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${name}`
          );
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    this.log('info', 'Server running on stdio');
  }
}
