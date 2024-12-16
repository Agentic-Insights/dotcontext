import { CallToolRequest, ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { ContextManager } from '../../core.js';
import { isDiagramsArgs } from '../types.js';
import { formatDiagramsOutput } from '../formatters/contextFormatter.js';

export async function handleDiagrams(request: CallToolRequest) {
  const { arguments: args } = request.params;

  if (!isDiagramsArgs(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid diagrams arguments: path must be a string and content (if provided) must be a boolean'
    );
  }

  const contextPath = args.path || '.context';
  const contextManager = new ContextManager();
  const diagrams = await contextManager.getDiagrams(contextPath);
  
  let diagramContent: Record<string, string> | undefined;
  if (args.content && diagrams.length > 0) {
    const context = await contextManager.getModuleContext(contextPath);
    diagramContent = context.diagrams;
  }
  
  return {
    content: [
      {
        type: 'text',
        text: formatDiagramsOutput(diagrams, diagramContent),
      },
    ],
  };
}