import { CallToolRequest, ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { ContextGenerator } from '../../lib/ContextGenerator.js';
import { isInitArgs } from '../types.js';

export async function handleInit(request: CallToolRequest) {
  const { arguments: args } = request.params;

  if (!isInitArgs(args)) {
    throw new McpError(ErrorCode.InvalidParams, 'Invalid init arguments');
  }

  const contextPath = args.path || '.context';
  const generator = new ContextGenerator(contextPath);
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