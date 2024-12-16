interface Component {
  name: string;
  description: string;
}

interface Pattern {
  name: string;
  usage: string;
}

interface RelatedModule {
  name: string;
  path: string;
  error?: string;
}

interface ContextMetadata {
  'module-name': string;
  description: string;
  architecture: {
    style: string;
    components: Component[];
    patterns: Pattern[];
  };
}

interface Context {
  metadata: ContextMetadata;
  relatedModules: RelatedModule[];
  diagrams: Record<string, string>;
}

export function formatContextOutput(context: Context, raw: boolean = false): string {
  if (raw) {
    return JSON.stringify(context, null, 2);
  }

  let formattedText = `\n📖 Module: ${context.metadata['module-name']}\n`;
  formattedText += `\nDescription: ${context.metadata.description}\n`;
  formattedText += `\n🏗️  Architecture:\n`;
  formattedText += `Style: ${context.metadata.architecture.style}\n`;
  
  formattedText += `\nComponents:\n`;
  context.metadata.architecture.components.forEach((comp: Component) => {
    formattedText += `  - ${comp.name}: ${comp.description}\n`;
  });
  
  formattedText += `\nPatterns:\n`;
  context.metadata.architecture.patterns.forEach((pattern: Pattern) => {
    formattedText += `  - ${pattern.name}: ${pattern.usage}\n`;
  });

  if (context.relatedModules.length > 0) {
    formattedText += `\n🔗 Related Modules:\n`;
    context.relatedModules.forEach((module: RelatedModule) => {
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

  return formattedText;
}

export function formatDiagramsOutput(diagrams: string[], content?: Record<string, string>): string {
  if (diagrams.length === 0) {
    return 'No diagrams found';
  }

  let formattedText = '\n📊 Available diagrams:\n';
  for (const diagram of diagrams) {
    formattedText += `  - ${diagram}\n`;
    if (content && content[diagram]) {
      formattedText += '\nContent:\n';
      formattedText += content[diagram];
      formattedText += '\n';
    }
  }

  return formattedText;
}