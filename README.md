# dotcontext

A convention developers can all easily adopt to capture and communicate the context of your codebase for both AI coding agents and humans. Similar to .env and .editorconfig, but focused on documenting your code.

This CLI tool helps you manage and validate codebase context specifications according to the [Codebase Context Specification (CCS)](https://github.com/Agentic-Insights/codebase-context-spec).

![Codebase Context](https://raw.githubusercontent.com/Agentic-Insights/codebase-context-spec/main/img/codebase-context.png)

## Learn More About CCS

- 📺 [Watch the CCS Introduction Video](https://youtu.be/g4YuNoLQ1zI)
- 📄 [Read the CCS RFC on SubStack](https://agenticinsights.substack.com/p/codebase-context-specification-rfc)
- 📚 [CCS GitHub Repository](https://github.com/Agentic-Insights/codebase-context-spec)

## Features

- ✅ Validate `.context` directories against CCS spec
- 🔧 Initialize new context directories and files
- 🚨 Lint context files for compliance and best practices
- 🛠️ Auto-fix common issues

## Installation

```bash
npm install -g dotcontext
```

## Usage

### Validate Context Directory

Checks if your `.context` directory complies with the CCS specification:

```bash
dotcontext validate
```

### Initialize Context Directory

Create a new `.context` directory with default structure and `.contextignore` file:

```bash
dotcontext init
```

### Lint Context Files

Check for best practices and potential improvements:

```bash
dotcontext lint
```

Auto-fix linting issues when possible:

```bash
dotcontext lint --fix
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
