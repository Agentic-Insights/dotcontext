import { CallToolRequest, ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { ContextManager } from '../../core.js';
import { isContextArgs } from '../types.js';
import { formatContextOutput } from '../formatters/contextFormatter.js';

export async function handleContext(request: CallToolRequest, contextManager: ContextManager) {
  const { arguments: args } = request.params;

  if (!isContextArgs(args)) {
    throw new McpError(ErrorCode.InvalidParams, 'Invalid context arguments');
  }

  const contextPath = args.path || '.context';
  
  // Add debug info
  console.error('Debug - CWD:', process.cwd());
  console.error('Debug - Context Path:', contextPath);
  
  const context = await contextManager.getModuleContext(contextPath);
  
  // Add debug path to context
  if (!context._debug) context._debug = {};
  context._debug.path = `${process.cwd()}/${contextPath}/index.md`;
  
  return {
    content: [
      {
        type: 'text',
        text: formatContextOutput(context, args.raw),
      },
    ],
  };
}
