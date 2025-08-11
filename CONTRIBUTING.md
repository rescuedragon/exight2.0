# 🤝 Contributing to Exight 2.0

Thank you for your interest in contributing to Exight 2.0! This document provides guidelines and standards for contributors.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Commit Message Format](#commit-message-format)
- [Release Process](#release-process)
- [Code Review Guidelines](#code-review-guidelines)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Setup
```bash
# Clone the repository
git clone <repository-url>
cd exight2.0-1

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔄 Development Workflow

### Branch Strategy
- **Main branch**: Production-ready code only
- **Dev branch**: Development and feature work
- **Feature branches**: Create from `dev` for new features
- **Hotfix branches**: Create from `main` for critical fixes

### Branch Naming Convention
```
feature/description-of-feature
fix/description-of-bug
chore/description-of-task
docs/description-of-documentation
```

## 📝 Code Standards

### TypeScript
- Use TypeScript strict mode
- Avoid `any` type unless absolutely necessary
- Define proper interfaces for all data structures
- Use meaningful type names

### React
- Use functional components with hooks
- Follow React best practices
- Use proper prop types and interfaces
- Implement proper error boundaries

### Styling
- Use Tailwind CSS for styling
- Follow component-based design
- Maintain consistent spacing and color schemes
- Use CSS variables for theme values

## 🔍 Linting & Formatting

### ESLint Rules
- TypeScript rules enabled
- React hooks rules enforced
- No unused variables or imports
- Consistent import ordering

### Prettier
- Automatic code formatting
- Consistent indentation (2 spaces)
- Trailing commas enabled
- Single quotes for strings

### Pre-commit Hooks
```bash
# Install husky hooks
npm run prepare

# Hooks will run automatically on commit:
# - ESLint check
# - Prettier formatting
# - Type checking
```

## 📤 Pull Request Guidelines

### Before Submitting
- [ ] Code follows project standards
- [ ] All tests pass
- [ ] No linting errors
- [ ] Documentation updated
- [ ] Self-review completed

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] Cross-browser testing done

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

## 💬 Commit Message Format

### Conventional Commits
```
type(scope): description

[optional body]

[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```
feat(expenses): add bulk delete functionality
fix(auth): resolve login redirect issue
docs(readme): update installation instructions
style(ui): improve button component styling
refactor(api): restructure expense endpoints
test(utils): add unit tests for date helpers
chore(deps): update dependencies to latest versions
```

## 🚀 Release Process

### Version Management
- Follow [Semantic Versioning](https://semver.org/)
- Major.Minor.Patch format
- Update CHANGELOG.md for each release

### Release Checklist
- [ ] All tests passing
- [ ] No critical bugs
- [ ] Documentation updated
- [ ] CHANGELOG updated
- [ ] Version bumped in package.json
- [ ] Release notes prepared

### Release Steps
1. Create release branch from `dev`
2. Update version numbers
3. Update CHANGELOG.md
4. Create release PR
5. Merge to `main` after approval
6. Tag release in GitHub
7. Deploy to production

## 👥 Code Review Guidelines

### For Reviewers
- Be constructive and respectful
- Focus on code quality and functionality
- Check for security issues
- Ensure tests are adequate
- Verify documentation updates

### For Authors
- Respond to feedback promptly
- Make requested changes clearly
- Ask questions if feedback is unclear
- Update PR based on review comments

## 🐛 Bug Reports

### Bug Report Template
```markdown
## Bug Description
Clear description of the issue

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., macOS, Windows, Linux]
- Browser: [e.g., Chrome, Firefox, Safari]
- Version: [e.g., 1.0.0]

## Additional Information
Screenshots, logs, or other relevant details
```

## 💡 Feature Requests

### Feature Request Template
```markdown
## Feature Description
Clear description of the requested feature

## Use Case
Why this feature is needed

## Proposed Solution
How you think it should work

## Alternatives Considered
Other approaches you've thought about

## Additional Context
Any other relevant information
```

## 📞 Getting Help

- **Issues**: Use GitHub Issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Code of Conduct**: Please read our [Code of Conduct](CODE_OF_CONDUCT.md)

## 🎯 Contribution Areas

### High Priority
- Bug fixes
- Performance improvements
- Accessibility enhancements
- Documentation updates

### Medium Priority
- New features
- UI/UX improvements
- Testing coverage
- Code refactoring

### Low Priority
- Nice-to-have features
- Cosmetic changes
- Experimental features

---

Thank you for contributing to Exight 2.0! 🎉
