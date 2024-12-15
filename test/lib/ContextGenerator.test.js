import { jest } from '@jest/globals';
import { ContextGenerator } from '../../src/lib/ContextGenerator.js';
import * as path from 'node:path';
// Mock fs/promises module
jest.mock('node:fs/promises', () => ({
    access: jest.fn(),
    mkdir: jest.fn(),
    writeFile: jest.fn()
}));
import * as fs from 'node:fs/promises';
describe('ContextGenerator', () => {
    let generator;
    const mockFs = fs;
    beforeEach(() => {
        generator = new ContextGenerator();
        jest.clearAllMocks();
        // Default mocks for non-existing files
        mockFs.access.mockRejectedValue(new Error('ENOENT'));
        mockFs.mkdir.mockResolvedValue(undefined);
        mockFs.writeFile.mockResolvedValue(undefined);
    });
    describe('generateContextDir', () => {
        it('should create directory when it does not exist', async () => {
            const result = await generator.generateContextDir();
            expect(result).toBe(true);
            expect(mockFs.mkdir).toHaveBeenCalledWith('.context', { recursive: true });
        });
        it('should not create directory when it already exists', async () => {
            mockFs.access.mockResolvedValue(undefined);
            const result = await generator.generateContextDir();
            expect(result).toBe(false);
            expect(mockFs.mkdir).not.toHaveBeenCalled();
        });
        it('should throw error when directory creation fails', async () => {
            mockFs.mkdir.mockRejectedValue(new Error('Permission denied'));
            await expect(generator.generateContextDir()).rejects.toThrow('Failed to generate context directory');
        });
    });
    describe('generateIndexFile', () => {
        it('should create index.md when it does not exist', async () => {
            const result = await generator.generateIndexFile();
            expect(result).toBe(true);
            expect(mockFs.writeFile).toHaveBeenCalledWith(expect.stringContaining('index.md'), expect.stringContaining('module-name:'));
        });
        it('should not create index.md when it already exists', async () => {
            mockFs.access.mockResolvedValue(undefined);
            const result = await generator.generateIndexFile();
            expect(result).toBe(false);
            expect(mockFs.writeFile).not.toHaveBeenCalled();
        });
        it('should throw error when file creation fails', async () => {
            mockFs.writeFile.mockRejectedValue(new Error('Permission denied'));
            await expect(generator.generateIndexFile()).rejects.toThrow('Failed to generate index file');
        });
        it('should include all required sections in index.md content', async () => {
            await generator.generateIndexFile();
            const writeFileCall = mockFs.writeFile.mock.calls[0];
            const content = writeFileCall[1];
            expect(content).toContain('module-name:');
            expect(content).toContain('version:');
            expect(content).toContain('description:');
            expect(content).toContain('technologies:');
            expect(content).toContain('architecture:');
            expect(content).toContain('development:');
            expect(content).toContain('business-requirements:');
            expect(content).toContain('quality-assurance:');
            expect(content).toContain('deployment:');
            expect(content).toContain('permissions:');
        });
    });
    describe('generateIgnoreFile', () => {
        it('should create .contextignore when it does not exist', async () => {
            const result = await generator.generateIgnoreFile();
            expect(result).toBe(true);
            expect(mockFs.writeFile).toHaveBeenCalledWith('.contextignore', expect.stringContaining('node_modules/'));
        });
        it('should not create .contextignore when it already exists', async () => {
            mockFs.access.mockResolvedValue(undefined);
            const result = await generator.generateIgnoreFile();
            expect(result).toBe(false);
            expect(mockFs.writeFile).not.toHaveBeenCalled();
        });
        it('should throw error when file creation fails', async () => {
            mockFs.writeFile.mockRejectedValue(new Error('Permission denied'));
            await expect(generator.generateIgnoreFile()).rejects.toThrow('Failed to generate ignore file');
        });
        it('should include common ignore patterns', async () => {
            await generator.generateIgnoreFile();
            const writeFileCall = mockFs.writeFile.mock.calls[0];
            const content = writeFileCall[1];
            expect(content).toContain('node_modules/');
            expect(content).toContain('dist/');
            expect(content).toContain('.env');
            expect(content).toContain('*.log');
        });
    });
    describe('generate', () => {
        it('should generate all files when none exist', async () => {
            const result = await generator.generate();
            expect(result).toEqual({
                dirCreated: true,
                indexCreated: true,
                ignoreCreated: true
            });
        });
        it('should not regenerate existing files', async () => {
            mockFs.access.mockResolvedValue(undefined);
            const result = await generator.generate();
            expect(result).toEqual({
                dirCreated: false,
                indexCreated: false,
                ignoreCreated: false
            });
        });
        it('should handle mixed existing and non-existing files', async () => {
            // Mock only directory exists
            mockFs.access.mockImplementation((path) => {
                if (path === '.context') {
                    return Promise.resolve(undefined);
                }
                return Promise.reject(new Error('ENOENT'));
            });
            const result = await generator.generate();
            expect(result).toEqual({
                dirCreated: false,
                indexCreated: true,
                ignoreCreated: true
            });
        });
    });
    describe('custom context directory', () => {
        it('should use custom directory path when provided', async () => {
            const customPath = path.join('custom', '.context');
            const customGenerator = new ContextGenerator(customPath);
            await customGenerator.generate();
            expect(mockFs.mkdir).toHaveBeenCalledWith(customPath, { recursive: true });
            expect(mockFs.writeFile).toHaveBeenCalledWith(path.join(customPath, 'index.md'), expect.any(String));
        });
    });
});
