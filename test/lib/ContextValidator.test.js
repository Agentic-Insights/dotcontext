import { jest } from '@jest/globals';
import { ContextValidator } from '../../src/lib/ContextValidator.js';
// Mock fs/promises module
jest.mock('fs/promises', () => ({
    access: jest.fn(),
    readFile: jest.fn()
}));
import * as fs from 'fs/promises';
describe('ContextValidator', () => {
    let validator;
    const mockFs = fs;
    beforeEach(() => {
        validator = new ContextValidator();
        jest.clearAllMocks();
        // Default successful mocks
        mockFs.access.mockResolvedValue(undefined);
        mockFs.readFile.mockResolvedValue(`
      module-name: test-module
      version: 1.0.0
      description: Test description
    `);
    });
    describe('validateContext', () => {
        it('should return true for valid context directory and files', async () => {
            const result = await validator.validateContext();
            expect(result).toBe(true);
            expect(mockFs.access).toHaveBeenCalledTimes(2); // Once for dir, once for index.md
        });
        it('should return false when context directory does not exist', async () => {
            mockFs.access.mockRejectedValueOnce(new Error('Directory not found'));
            const result = await validator.validateContext();
            expect(result).toBe(false);
        });
        it('should return false when index.md is missing', async () => {
            mockFs.access.mockImplementation((filePath) => {
                if (filePath.toString().includes('index.md')) {
                    return Promise.reject(new Error('File not found'));
                }
                return Promise.resolve(undefined);
            });
            const result = await validator.validateContext();
            expect(result).toBe(false);
        });
        it('should return false when index.md has invalid content', async () => {
            mockFs.readFile.mockResolvedValueOnce('invalid content');
            const result = await validator.validateContext();
            expect(result).toBe(false);
        });
    });
    describe('validateIndexContent', () => {
        it('should return true when all required fields are present', async () => {
            const validContent = `
        module-name: test-module
        version: 1.0.0
        description: Test description
      `;
            mockFs.readFile.mockResolvedValueOnce(validContent);
            const result = await validator.validateContext();
            expect(result).toBe(true);
        });
        it('should return false when required fields are missing', async () => {
            const invalidContent = `
        module-name: test-module
        version: 1.0.0
        # Missing description field
      `;
            mockFs.readFile.mockResolvedValueOnce(invalidContent);
            const result = await validator.validateContext();
            expect(result).toBe(false);
        });
        it('should be case insensitive when checking fields', async () => {
            const mixedCaseContent = `
        MODULE-NAME: test-module
        Version: 1.0.0
        Description: Test description
      `;
            mockFs.readFile.mockResolvedValueOnce(mixedCaseContent);
            const result = await validator.validateContext();
            expect(result).toBe(true);
        });
    });
});
