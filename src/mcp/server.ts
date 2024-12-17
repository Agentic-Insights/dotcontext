import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { ContextManager } from '../core.js';
import { handleInit } from './handlers/init.js';
import { handleValidate } from './handlers/validate.js';
import { handleContext } from './handlers/context.js';
import { handleDiagrams } from './handlers/diagrams.js';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

export class DotContextServer {
  private server: Server;
  private contextManager: ContextManager;

  constructor() {
    // Get the directory of the executed script
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    // Go up two directories from dist/mcp/server.js to get to the project root
    const projectRoot = resolve(__dirname, '..', '..');

    // Log paths for debugging
    console.error('Server CWD:', process.cwd());
    console.error('Server __dirname:', __dirname);
    console.error('Server projectRoot:', projectRoot);
    console.error('Server process.argv:', process.argv);

    this.server = new Server(
      {
        name: 'dotcontext',
        version: '1.3.1', // Match package.json version
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
      // Only log actual errors, not debug info
      if (error instanceof McpError) {
        console.error('[MCP Error]', error.message);
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
    console.error('Server running on stdio');
  }
}
