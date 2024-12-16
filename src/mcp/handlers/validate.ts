import { CallToolRequest, ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { ContextManager } from '../../core.js';
import { isValidateArgs } from '../types.js';

export async function handleValidate(request: CallToolRequest) {
  const { arguments: args } = request.params;

  if (!isValidateArgs(args)) {
    throw new McpError(ErrorCode.InvalidParams, 'Invalid validate arguments');
  }

  const contextPath = args.path || '.context';
  const contextManager = new ContextManager();
  const result = await contextManager.validateContextStructure(contextPath);
  
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