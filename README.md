# cc-linter

A CLI tool for managing and validating codebase context specifications according to the [Codebase Context Specification (CCS)](https://github.com/Agentic-Insights/codebase-context-spec).

![Codebase Context](https://raw.githubusercontent.com/Agentic-Insights/codebase-context-spec/main/img/codebase-context.png)

## Features

- ✅ Validate `.context` directories against CCS spec
- 🔧 Generate new context files and directories
- 🚨 Lint context files for compliance and best practices
- 🛠️ Auto-fix common issues

## Installation

```bash
npm install -g cc-linter
```

## Usage

### Validate Context Directory

Checks if your `.context` directory complies with the CCS specification:

```bash
cc-linter validate
```

### Generate Context Files

Create a new `.context` directory with default structure:

```bash
cc-linter generate --type context
```

Generate a `.contextignore` file with default patterns:

```bash
cc-linter generate --type ignore
```

### Lint Context Files

Check for best practices and potential improvements:

```bash
cc-linter lint
```

Auto-fix linting issues when possible:

```bash
cc-linter lint --fix
```

## Development

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```
4. Link for local development:
   ```bash
   npm link
   ```

### Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## Contributing

Contributions are welcome! Please ensure you follow our contribution guidelines and maintain test coverage for new features.

## License

MIT
