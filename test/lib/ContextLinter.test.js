import { jest } from '@jest/globals';
import { ContextLinter } from '../../src/lib/ContextLinter.js';
// Mock fs/promises module
jest.mock('fs/promises', () => ({
    access: jest.fn(),
    readFile: jest.fn(),
    writeFile: jest.fn()
}));
import * as fs from 'fs/promises';
describe('ContextLinter', () => {
    let linter;
    const mockFs = fs;
    beforeEach(() => {
        linter = new ContextLinter();
        jest.clearAllMocks();
        // Default successful mocks
        mockFs.access.mockResolvedValue(undefined);
        mockFs.writeFile.mockResolvedValue(undefined);
    });
    describe('lint', () => {
        it('should return no issues for valid content', async () => {
            const validContent = `---
module-name: test-module
version: 1.0.0
description: Test description
technologies: [TypeScript, Node.js]
architecture: MVC
`;
            mockFs.readFile.mockResolvedValue(validContent);
            const result = await linter.lint();
            expect(result.issues).toHaveLength(0);
            expect(result.fixedCount).toBe(0);
        });
        it('should detect missing frontmatter delimiter', async () => {
            const invalidContent = `
module-name: test-module
version: 1.0.0
description: Test description
technologies: [TypeScript, Node.js]
architecture: MVC
`;
            mockFs.readFile.mockResolvedValue(invalidContent);
            const result = await linter.lint();
            expect(result.issues).toHaveLength(1);
            expect(result.issues[0].message).toContain('Missing frontmatter delimiter');
        });
        it('should detect missing required fields', async () => {
            const incompleteContent = `---
module-name: test-module
version: 1.0.0
`;
            mockFs.readFile.mockResolvedValue(incompleteContent);
            const result = await linter.lint();
            expect(result.issues.length).toBeGreaterThan(0);
            expect(result.issues.some(i => i.message.includes('Missing required field: description'))).toBe(true);
            expect(result.issues.some(i => i.message.includes('Missing required field: technologies'))).toBe(true);
            expect(result.issues.some(i => i.message.includes('Missing required field: architecture'))).toBe(true);
        });
        it('should detect invalid version format', async () => {
            const invalidVersionContent = `---
module-name: test-module
version: 1.0
description: Test description
technologies: [TypeScript, Node.js]
architecture: MVC
`;
            mockFs.readFile.mockResolvedValue(invalidVersionContent);
            const result = await linter.lint();
            expect(result.issues).toHaveLength(1);
            expect(result.issues[0].message).toBe('Invalid version format');
        });
        describe('auto-fix mode', () => {
            it('should fix missing frontmatter delimiter', async () => {
                const invalidContent = `
module-name: test-module
version: 1.0.0
description: Test description
technologies: [TypeScript, Node.js]
architecture: MVC
`;
                mockFs.readFile.mockResolvedValue(invalidContent);
                const result = await linter.lint(true);
                expect(result.fixedCount).toBe(1);
                expect(mockFs.writeFile).toHaveBeenCalled();
                const writtenContent = mockFs.writeFile.mock.calls[0][1];
                expect(writtenContent.startsWith('---')).toBe(true);
            });
            it('should fix missing required fields', async () => {
                const incompleteContent = `---
module-name: test-module
version: 1.0.0
`;
                mockFs.readFile.mockResolvedValue(incompleteContent);
                const result = await linter.lint(true);
                expect(result.fixedCount).toBe(3); // description, technologies, architecture
                expect(mockFs.writeFile).toHaveBeenCalled();
                const writtenContent = mockFs.writeFile.mock.calls[0][1];
                expect(writtenContent).toContain('description:');
                expect(writtenContent).toContain('technologies:');
                expect(writtenContent).toContain('architecture:');
            });
        });
        describe('error handling', () => {
            it('should throw error when context directory does not exist', async () => {
                mockFs.access.mockRejectedValue(new Error('Directory not found'));
                await expect(linter.lint()).rejects.toThrow('Linting failed');
            });
            it('should throw error when index.md cannot be read', async () => {
                mockFs.readFile.mockRejectedValue(new Error('File read error'));
                await expect(linter.lint()).rejects.toThrow('Linting failed');
            });
        });
    });
});
