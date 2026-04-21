# Contributing to Onboard

Thank you for your interest in contributing to Onboard! We welcome contributions from developers of all skill levels.

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Making Changes](#making-changes)
5. [Submitting Changes](#submitting-changes)
6. [Reporting Bugs](#reporting-bugs)
7. [Suggesting Features](#suggesting-features)

## 📜 Code of Conduct

By participating in this project, you agree to maintain a welcoming and respectful environment for everyone. We expect all contributors to:

- Be polite and constructive in all communications
- Respect different viewpoints and experiences
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a branch for your changes
4. Make your changes
5. Test your changes
6. Submit a pull request

## 🔧 Development Setup

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn
- Git

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/Onboard.git
cd Onboard

# Add upstream remote
git remote add upstream https://github.com/moggan1337/Onboard.git

# Install dependencies
npm install

# Create a feature branch
git checkout -b feature/amazing-feature
```

### Running the Project

```bash
# Run in development mode
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```

## 🛠️ Making Changes

### Code Style

We use ESLint and Prettier for code formatting. Please ensure your code follows these conventions:

```bash
# Check for linting errors
npm run lint

# Auto-fix linting issues
npm run lint -- --fix
```

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
feat: add new feature
fix: resolve a bug
docs: update documentation
style: format code without logic changes
refactor: restructure code without behavior change
test: add or update tests
chore: maintenance tasks
```

Examples:
- `feat: add GitHub Actions integration`
- `fix: resolve memory leak in knowledge extractor`
- `docs: update README with new examples`

### Testing

All new features should include tests. Run tests with:

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Watch mode for development
npm test -- --watch
```

### Writing Tests

Use the following patterns:

```javascript
describe('FeatureName', () => {
  it('should do something specific', () => {
    // Test implementation
    assert.strictEqual(result, expected);
  });
});
```

## 📤 Submitting Changes

1. Ensure all tests pass
2. Update documentation if needed
3. Commit your changes with a clear message
4. Push to your fork
5. Open a Pull Request

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Test update

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Code follows style guidelines
- [ ] Breaking changes documented

## Screenshots (if applicable)
Add screenshots for UI changes
```

## 🐛 Reporting Bugs

Before submitting a bug report:

1. Check existing issues
2. Try to reproduce the issue
3. Gather relevant information

When reporting a bug, include:

- Clear, descriptive title
- Steps to reproduce
- Expected behavior
- Actual behavior
- Error messages
- Environment details (OS, Node version, etc.)
- Code samples if applicable

## 💡 Suggesting Features

We welcome feature suggestions! When suggesting a feature:

1. Explain the problem you're trying to solve
2. Describe your proposed solution
3. Consider alternatives
4. Provide use cases

## 📝 Additional Resources

- [Documentation](https://github.com/moggan1337/Onboard#readme)
- [Issue Tracker](https://github.com/moggan1337/Onboard/issues)
- [Discussions](https://github.com/moggan1337/Onboard/discussions)

## 🙏 Thank You

Every contribution, no matter how small, helps make Onboard better for everyone. Thank you for taking the time to contribute!

---

**Questions?** Feel free to open an issue or reach out to the maintainers.
