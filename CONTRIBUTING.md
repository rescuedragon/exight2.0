# Contributing to Exight 2.0

Thank you for your interest in contributing to Exight 2.0! This document provides guidelines for contributing to the project.

## 🚀 Quick Start

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit with conventional commit format: `git commit -m "feat: add amazing feature"`
5. Push to your branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📝 Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependencies, etc.

### Examples:
```
feat: add export data functionality
fix(ui): resolve skeleton loader display issue
docs: update README with new features
style: format code with prettier
refactor: simplify expense calculation logic
```

## 🔧 Development Setup

### Prerequisites
- Node.js 18+ 
- npm, yarn, or bun
- Git

### Local Development
```bash
# Clone the repository
git clone https://github.com/yourusername/exight2.0.git
cd exight2.0

# Install dependencies
npm install

# Start development server
npm run dev

# Run linting
npm run lint

# Run tests
npm run test

# Build for production
npm run build
```

## 🧪 Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Add tests for bug fixes
- Maintain test coverage above 75%

## 📋 Pull Request Guidelines

### Before Submitting:
1. **Test thoroughly** - Ensure your changes work as expected
2. **Update documentation** - Update README, API docs, etc.
3. **Follow coding standards** - Use ESLint and Prettier
4. **Write clear commit messages** - Follow conventional commit format
5. **Update tests** - Add/update tests for new functionality

### PR Template:
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Local testing completed
- [ ] All tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

## 🎨 Code Style

### JavaScript/TypeScript
- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for formatting
- Prefer functional components with hooks
- Use meaningful variable and function names

### CSS/Tailwind
- Use Tailwind CSS utility classes
- Follow component-based styling approach
- Maintain consistent spacing and color schemes

### React
- Use functional components
- Implement proper error boundaries
- Follow React best practices
- Use React Query for data fetching

## 🚫 What Not to Do

- Don't commit directly to main branch
- Don't ignore linting errors
- Don't submit untested code
- Don't break existing functionality
- Don't ignore accessibility guidelines

## 🐛 Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser/device information
- Screenshots if applicable

## 💡 Feature Requests

For feature requests:
- Describe the feature clearly
- Explain the use case
- Consider implementation complexity
- Discuss with maintainers first

## 📞 Getting Help

- Open an issue for bugs or feature requests
- Join our community discussions
- Check existing issues and PRs
- Review documentation

## 🏆 Recognition

Contributors will be recognized in:
- Project README
- Release notes
- Contributors list

Thank you for contributing to Exight 2.0! 🎉
