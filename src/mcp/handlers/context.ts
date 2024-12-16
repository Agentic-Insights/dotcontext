import { CallToolRequest, ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { ContextManager } from '../../core.js';
import { isContextArgs } from '../types.js';
import { formatContextOutput } from '../formatters/contextFormatter.js';

export async function handleContext(request: CallToolRequest) {
  const { arguments: args } = request.params;

  if (!isContextArgs(args)) {
    throw new McpError(ErrorCode.InvalidParams, 'Invalid context arguments');
  }

  const contextPath = args.path || '.context';
  const contextManager = new ContextManager();
  const context = await contextManager.getModuleContext(contextPath);
  
  return {
    content: [
      {
        type: 'text',
        text: formatContextOutput(context, args.raw),
      },
    ],
  };
}