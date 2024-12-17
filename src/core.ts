import { ContextCollector } from './lib/ContextCollector.js';

export class ContextManager {
  private collector: ContextCollector;

  constructor(baseDir: string = process.cwd()) {
    this.collector = new ContextCollector(baseDir);
  }

  async validateContextStructure(dirPath: string) {
    return this.collector.validateContextStructure(dirPath);
  }

  async getModuleContext(dirPath: string) {
    return this.collector.collect(dirPath);
  }

  async getDiagrams(dirPath: string) {
    return this.collector.getDiagrams(dirPath);
  }
}
