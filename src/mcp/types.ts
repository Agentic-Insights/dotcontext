import { CallToolRequest } from '@modelcontextprotocol/sdk/types.js';

export interface InitArgs {
  path: string;
}

export interface ValidateArgs {
  path: string;
}

export interface ContextArgs {
  path: string;
  raw?: boolean;
}

export interface DiagramsArgs {
  path: string;
  content?: boolean;
}

export const isInitArgs = (args: unknown): args is InitArgs =>
  typeof args === 'object' &&
  args !== null &&
  (typeof (args as InitArgs).path === 'string' || typeof (args as InitArgs).path === 'undefined');

export const isValidateArgs = (args: unknown): args is ValidateArgs =>
  typeof args === 'object' &&
  args !== null &&
  (typeof (args as ValidateArgs).path === 'string' || typeof (args as ValidateArgs).path === 'undefined');

export const isContextArgs = (args: unknown): args is ContextArgs =>
  typeof args === 'object' &&
  args !== null &&
  (typeof (args as ContextArgs).path === 'string' || typeof (args as ContextArgs).path === 'undefined') &&
  (typeof (args as ContextArgs).raw === 'undefined' ||
    typeof (args as ContextArgs).raw === 'boolean');

export const isDiagramsArgs = (args: unknown): args is DiagramsArgs =>
  typeof args === 'object' &&
  args !== null &&
  (typeof (args as DiagramsArgs).path === 'string' || typeof (args as DiagramsArgs).path === 'undefined') &&
  (typeof (args as DiagramsArgs).content === 'undefined' ||
    typeof (args as DiagramsArgs).content === 'boolean');

export type ToolHandler = (request: CallToolRequest) => Promise<{
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
}>;