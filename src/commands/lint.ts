import { ContextLinter } from '../lib/ContextLinter.js';

interface LintIssue {
  message: string;
  file: string;
  line: number;
  suggestion?: string;
}

interface LintOptions {
  fix?: boolean;
}

export const lint = async (options: LintOptions) => {
  try {
    const linter = new ContextLinter();
    const results = await linter.lint(options.fix);
    
    if (results.issues.length === 0) {
      console.log('✅ No linting issues found');
      process.exit(0);
    } else {
      console.log('\nLinting issues found:');
      results.issues.forEach((issue: LintIssue) => {
        console.log(`\n❌ ${issue.message}`);
        console.log(`   File: ${issue.file}`);
        console.log(`   Line: ${issue.line}`);
        if (issue.suggestion) {
          console.log(`   Suggestion: ${issue.suggestion}`);
        }
      });
      
      if (results.fixedCount > 0) {
        console.log(`\n✅ Fixed ${results.fixedCount} issue(s)`);
      }
      
      process.exit(results.fixedCount === results.issues.length ? 0 : 1);
    }
  } catch (error) {
    console.error('Error during linting:', error);
    process.exit(1);
  }
};
