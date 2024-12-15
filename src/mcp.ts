#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
  CallToolRequest,
} from '@modelcontextprotocol/sdk/types.js';
import path from 'path';

// Import from local files
import { ContextManager } from './core.js';
import { ContextGenerator } from './lib/ContextGenerator.js';

interface InitArgs {
  path: string;
}

interface ValidateArgs {
  path: string;
}

interface ContextArgs {
  path: string;
  raw?: boolean;
}

interface DiagramsArgs {
  path: string;
  content?: boolean;
}

const isInitArgs = (args: unknown): args is InitArgs =>
  typeof args === 'object' &&
  args !== null &&
  typeof (args as InitArgs).path === 'string';

const isValidateArgs = (args: unknown): args is ValidateArgs =>
  typeof args === 'object' &&
  args !== null &&
  typeof (args as ValidateArgs).path === 'string';

const isContextArgs = (args: unknown): args is ContextArgs =>
  typeof args === 'object' &&
  args !== null &&
  typeof (args as ContextArgs).path === 'string' &&
  (typeof (args as ContextArgs).raw === 'undefined' ||
    typeof (args as ContextArgs).raw === 'boolean');

const isDiagramsArgs = (args: unknown): args is DiagramsArgs =>
  typeof args === 'object' &&
  args !== null &&
  typeof (args as DiagramsArgs).path === 'string' &&
  (typeof (args as DiagramsArgs).content === 'undefined' ||
    typeof (args as DiagramsArgs).content === 'boolean');

class DotContextServer {
  private server: Server;
  private contextManager: ContextManager;
  private ContextGenerator: typeof ContextGenerator;

  constructor() {
    this.server = new Server(
      {
        name: 'dotcontext',
        version: '1.2.1',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize dotcontext classes
    this.contextManager = new ContextManager();
    this.ContextGenerator = ContextGenerator;
    
    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error: Error) => console.error('[MCP Error]', error);
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
                description: 'Directory path where to initialize .context',
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
                description: 'Path to the .context directory',
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
                description: 'Path to the .context directory',
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
                description: 'Path to the .context directory',
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

    this.server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'init': {
            if (!isInitArgs(args)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid init arguments');
            }
            const generator = new this.ContextGenerator();
            const result = await generator.generate();
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({
                    success: true,
                    dirCreated: result.dirCreated,
                    indexCreated: result.indexCreated,
                    ignoreCreated: result.ignoreCreated,
                  }, null, 2),
                },
              ],
            };
          }

          case 'validate': {
            if (!isValidateArgs(args)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid validate arguments');
            }
            const absolutePath = path.resolve(args.path);
            const result = await this.contextManager.validateContextStructure(absolutePath);
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({
                    valid: result.valid,
                    errors: result.errors,
                  }, null, 2),
                },
              ],
            };
          }

          case 'context': {
            if (!isContextArgs(args)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid context arguments');
            }
            const absolutePath = path.resolve(args.path);
            const context = await this.contextManager.getModuleContext(absolutePath);
            
            if (args.raw) {
              return {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify(context, null, 2),
                  },
                ],
              };
            }

            // Format context information
            let formattedText = `\n📖 Module: ${context.metadata['module-name']}\n`;
            formattedText += `\nDescription: ${context.metadata.description}\n`;
            formattedText += `\n🏗️  Architecture:\n`;
            formattedText += `Style: ${context.metadata.architecture.style}\n`;
            formattedText += `\nComponents:\n`;
            context.metadata.architecture.components.forEach((comp: any) => {
              formattedText += `  - ${comp.name}: ${comp.description}\n`;
            });
            formattedText += `\nPatterns:\n`;
            context.metadata.architecture.patterns.forEach((pattern: any) => {
              formattedText += `  - ${pattern.name}: ${pattern.usage}\n`;
            });

            if (context.relatedModules.length > 0) {
              formattedText += `\n🔗 Related Modules:\n`;
              context.relatedModules.forEach((module: any) => {
                formattedText += `  - ${module.name} (${module.path})\n`;
                if (module.error) {
                  formattedText += `    ⚠️  Error: ${module.error}\n`;
                }
              });
            }

            if (Object.keys(context.diagrams).length > 0) {
              formattedText += `\n📊 Diagrams:\n`;
              Object.keys(context.diagrams).forEach(diagram => {
                formattedText += `  - ${diagram}\n`;
              });
            }

            return {
              content: [
                {
                  type: 'text',
                  text: formattedText,
                },
              ],
            };
          }

          case 'diagrams': {
            if (!isDiagramsArgs(args)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid diagrams arguments');
            }
            const absolutePath = path.resolve(args.path);
            const diagrams = await this.contextManager.getDiagrams(absolutePath);
            
            let formattedText = '';
            if (diagrams.length === 0) {
              formattedText = 'No diagrams found';
            } else {
              formattedText = '\n📊 Available diagrams:\n';
              for (const diagram of diagrams) {
                formattedText += `  - ${diagram}\n`;
                if (args.content) {
                  const context = await this.contextManager.getModuleContext(absolutePath);
                  if (context.diagrams[diagram]) {
                    formattedText += '\nContent:\n';
                    formattedText += context.diagrams[diagram];
                    formattedText += '\n';
                  }
                }
              }
            }

            return {
              content: [
                {
                  type: 'text',
                  text: formattedText,
                },
              ],
            };
          }

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
    console.error('DotContext MCP server running on stdio');
  }
}

const server = new DotContextServer();
server.run().catch(console.error);