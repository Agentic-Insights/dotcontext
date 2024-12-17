interface Component {
  name: string;
  description: string;
}

interface Pattern {
  name: string;
  usage: string;
}

interface Development {
  setup?: string[];
  testing?: {
    framework?: string;
    coverage?: string;
  };
  deployment?: {
    platform?: string;
    pipeline?: string;
  };
  [key: string]: any;
}

interface Architecture {
  style: string;
  components: Component[];
  patterns: Pattern[];
}

interface Metadata {
  'module-name': string;
  version?: string;
  description: string;
  technologies?: string[];
  conventions?: string[];
  architecture: Architecture;
  development?: Development;
  'business-requirements'?: string[];
  permissions?: {
    'allow-ai-modifications'?: boolean;
    [key: string]: any;
  };
  [key: string]: any;
}

interface RelatedModule {
  name: string;
  path: string;
  error?: string;
}

interface Context {
  metadata: Metadata;
  relatedModules: RelatedModule[];
  diagrams: Record<string, string>;
  unstructured: string;
  _debug?: {
    path?: string;
  };
}

export function formatContextOutput(context: Context, raw: boolean = false): string {
  if (raw) {
    return JSON.stringify(context, null, 2);
  }

  let output = '';

  // Module Information
  output += `📖 Module: ${context.metadata['module-name']}\n\n`;
  output += `Description: ${context.metadata.description}\n\n`;

  // Architecture
  output += '🏗️  Architecture:\n';
  output += `Style: ${context.metadata.architecture.style}\n\n`;

  if (context.metadata.architecture.components.length) {
    output += 'Components:\n';
    context.metadata.architecture.components.forEach(comp => {
      output += `• ${comp.name}${comp.description ? `: ${comp.description}` : ''}\n`;
    });
    output += '\n';
  }

  if (context.metadata.architecture.patterns.length) {
    output += 'Patterns:\n';
    context.metadata.architecture.patterns.forEach(pattern => {
      output += `• ${pattern.name}${pattern.usage ? `: ${pattern.usage}` : ''}\n`;
    });
    output += '\n';
  }

  // Unstructured Content
  if (context.unstructured) {
    output += `📝 Unstructured Content (${context._debug?.path || 'unknown path'}):\n`;
    output += context.unstructured;
  }

  return output;
}

export function formatDiagramsOutput(diagrams: string[], content?: Record<string, string>): string {
  if (diagrams.length === 0) {
    return 'No diagrams found in the context directory.';
  }

  let output = '\n📊 Available Diagrams\n';
  output += '══════════════════\n\n';

  for (const diagram of diagrams) {
    output += `• ${diagram}\n`;
    if (content && content[diagram]) {
      output += '\nContent:\n';
      output += '```mermaid\n';
      output += content[diagram];
      output += '\n```\n\n';
    }
  }

  return output;
}
