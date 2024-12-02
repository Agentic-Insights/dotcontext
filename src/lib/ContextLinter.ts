import * as fs from 'fs/promises';
import * as path from 'path';

interface LintIssue {
  message: string;
  file: string;
  line: number;
  suggestion?: string;
}

interface LintResults {
  issues: LintIssue[];
  fixedCount: number;
}

export class ContextLinter {
  private readonly contextDir = '.context';

  async lint(fix: boolean = false): Promise<LintResults> {
    const issues: LintIssue[] = [];
    let fixedCount = 0;

    try {
      // Check if .context directory exists
      await fs.access(this.contextDir);
      
      // Read and lint index.md
      const indexPath = path.join(this.contextDir, 'index.md');
      const content = await fs.readFile(indexPath, 'utf-8');
      const lines = content.split('\n');
      
      // Check frontmatter format
      if (!content.startsWith('---')) {
        issues.push({
          message: 'Missing frontmatter delimiter at the start',
          file: 'index.md',
          line: 1,
          suggestion: 'Add "---" at the start of the file'
        });
      }

      // Check required fields
      const requiredFields = [
        'module-name',
        'version',
        'description',
        'technologies',
        'architecture'
      ];

      requiredFields.forEach((field, index) => {
        const lineIndex = lines.findIndex(line => 
          line.toLowerCase().startsWith(`${field.toLowerCase()}:`)
        );
        
        if (lineIndex === -1) {
          issues.push({
            message: `Missing required field: ${field}`,
            file: 'index.md',
            line: index + 1,
            suggestion: `Add "${field}: your-value-here"`
          });
        }
      });

      // Check version format
      const versionLine = lines.find(line => 
        line.toLowerCase().startsWith('version:')
      );
      if (versionLine) {
        const version = versionLine.split(':')[1]?.trim();
        if (!version?.match(/^\d+\.\d+\.\d+$/)) {
          issues.push({
            message: 'Invalid version format',
            file: 'index.md',
            line: lines.indexOf(versionLine) + 1,
            suggestion: 'Use semantic versioning format (e.g., 1.0.0)'
          });
        }
      }

      // Auto-fix issues if requested
      if (fix) {
        let fixedContent = content;
        
        // Add missing frontmatter if needed
        if (!content.startsWith('---')) {
          fixedContent = `---\n${fixedContent}`;
          fixedCount++;
        }

        // Add missing required fields
        requiredFields.forEach(field => {
          if (!content.toLowerCase().includes(`${field.toLowerCase()}:`)) {
            fixedContent += `\n${field}: `;
            fixedCount++;
          }
        });

        if (fixedCount > 0) {
          await fs.writeFile(indexPath, fixedContent);
        }
      }

      return { issues, fixedCount };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Linting failed: ${error.message}`);
      }
      throw error;
    }
  }
}
