# 📋 Development Conventions

This document outlines the development conventions and standards for Exight 2.0. Following these conventions ensures consistency and maintainability across the project.

## 🌿 Branch Naming Convention

### Branch Types

| Type              | Format                 | Example                          | Description               |
| ----------------- | ---------------------- | -------------------------------- | ------------------------- |
| **Feature**       | `feature/description`  | `feature/user-authentication`    | New functionality         |
| **Bug Fix**       | `fix/description`      | `fix/login-validation-error`     | Bug fixes                 |
| **Hotfix**        | `hotfix/description`   | `hotfix/critical-security-patch` | Critical production fixes |
| **Documentation** | `docs/description`     | `docs/api-documentation`         | Documentation updates     |
| **Chore**         | `chore/description`    | `chore/update-dependencies`      | Maintenance tasks         |
| **Refactor**      | `refactor/description` | `refactor/expense-calculator`    | Code refactoring          |
| **Test**          | `test/description`     | `test/add-unit-tests`            | Testing related           |
| **Style**         | `style/description`    | `style/format-code`              | Code style changes        |

### Branch Naming Rules

- Use lowercase letters
- Separate words with hyphens (`-`)
- Keep names descriptive but concise
- Avoid special characters except hyphens
- Use present tense

### Examples

```bash
# ✅ Good examples
feature/add-expense-tracking
fix/resolve-chart-rendering-issue
docs/update-installation-guide
chore/upgrade-react-version

# ❌ Bad examples
Feature/AddExpenseTracking
fix/chart_issue
docs/update-guide
chore/upgrade
```

## 💬 Commit Message Format

### Conventional Commits Standard

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages.

#### Format

```
type(scope): description

[optional body]

[optional footer]
```

#### Commit Types

| Type       | Description              | Example                                        |
| ---------- | ------------------------ | ---------------------------------------------- |
| `feat`     | New feature              | `feat(auth): add OAuth2 authentication`        |
| `fix`      | Bug fix                  | `fix(ui): resolve button alignment issue`      |
| `docs`     | Documentation            | `docs(readme): add deployment instructions`    |
| `style`    | Code style changes       | `style(components): format with prettier`      |
| `refactor` | Code refactoring         | `refactor(api): restructure endpoint logic`    |
| `test`     | Testing                  | `test(utils): add unit tests for calculator`   |
| `chore`    | Maintenance tasks        | `chore(deps): update dependencies`             |
| `perf`     | Performance improvements | `perf(charts): optimize rendering performance` |
| `ci`       | CI/CD changes            | `ci(github): add automated testing workflow`   |
| `build`    | Build system changes     | `build(vite): update build configuration`      |

#### Scope

The scope should be the name of the component, module, or area being changed:

- `(auth)` - Authentication related
- `(ui)` - User interface components
- `(api)` - API endpoints
- `(db)` - Database related
- `(expenses)` - Expense management
- `(loans)` - Loan management
- `(charts)` - Charting and analytics
- `(utils)` - Utility functions
- `(docs)` - Documentation
- `(deps)` - Dependencies

#### Examples

```bash
# ✅ Good examples
feat(expenses): add bulk delete functionality
fix(auth): resolve login redirect loop
docs(api): add endpoint documentation
style(ui): improve button component styling
refactor(utils): restructure date helper functions
test(components): add snapshot tests for modals
chore(deps): update react to v18.2.0

# ❌ Bad examples
feat: add new feature
fix: bug fix
update code
wip
```

#### Breaking Changes

For breaking changes, add `!` after the type/scope and include `BREAKING CHANGE:` in the footer:

```bash
feat(api)!: change response format

BREAKING CHANGE: API now returns data in camelCase instead of snake_case
```

## 🏷️ Issue Templates

### Bug Report Template

```markdown
## 🐛 Bug Description

Brief description of the issue

## 🔍 Steps to Reproduce

1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## ✅ Expected Behavior

What should happen

## ❌ Actual Behavior

What actually happens

## 📱 Environment

- **OS**: [e.g., macOS, Windows, Linux]
- **Browser**: [e.g., Chrome, Firefox, Safari]
- **Version**: [e.g., 1.0.0]
- **Device**: [e.g., Desktop, Mobile, Tablet]

## 📸 Screenshots

If applicable, add screenshots to help explain the problem

## 📋 Additional Context

Add any other context about the problem here

## 🔧 Possible Solution

If you have suggestions on a fix for the bug

## 📝 Labels

- [ ] Bug
- [ ] UI/UX
- [ ] Performance
- [ ] Security
```

### Feature Request Template

```markdown
## 🚀 Feature Description

Clear description of the requested feature

## 💡 Use Case

Why this feature is needed and how it would be used

## 🎯 Proposed Solution

How you think this feature should work

## 🔄 Alternatives Considered

Other approaches you've thought about

## 📱 Platform

- [ ] Web
- [ ] Mobile
- [ ] Desktop
- [ ] All platforms

## 🏷️ Labels

- [ ] Enhancement
- [ ] UI/UX
- [ ] Performance
- [ ] Accessibility
```

### Documentation Request Template

```markdown
## 📚 Documentation Need

What documentation is missing or needs improvement

## 🎯 Target Audience

Who needs this documentation (developers, users, contributors)

## 📖 Current State

What documentation currently exists (if any)

## ✨ Desired Outcome

What the improved documentation should look like

## 🔗 Related Links

Links to related issues, PRs, or documentation

## 🏷️ Labels

- [ ] Documentation
- [ ] Help wanted
- [ ] Good first issue
```

## 📁 File and Folder Naming

### File Naming Convention

- Use **kebab-case** for file names
- Use **PascalCase** for React component files
- Use **camelCase** for utility files
- Use descriptive names that indicate purpose

```bash
# ✅ Good examples
user-profile.tsx
expense-dashboard.tsx
api-client.ts
date-utils.ts
validation-helpers.ts

# ❌ Bad examples
userProfile.tsx
expense_dashboard.tsx
api.ts
utils.ts
helpers.ts
```

### Folder Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── forms/          # Form components
│   └── charts/         # Chart components
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
├── types/               # TypeScript type definitions
├── pages/               # Page components
└── contexts/            # React contexts
```

## 🎨 Code Style Conventions

### TypeScript

- Use strict mode
- Prefer interfaces over types for objects
- Use meaningful type names
- Avoid `any` type
- Use union types for better type safety

```typescript
// ✅ Good examples
interface Expense {
  id: string;
  amount: number;
  description: string;
  date: Date;
}

type PaymentStatus = 'pending' | 'completed' | 'failed';

// ❌ Bad examples
interface Expense {
  id: any;
  amount: any;
  description: any;
  date: any;
}
```

### React Components

- Use functional components with hooks
- Use PascalCase for component names
- Use camelCase for props
- Destructure props at the beginning
- Use meaningful prop names

```typescript
// ✅ Good examples
interface ExpenseCardProps {
  expense: Expense;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onEdit, onDelete }) => {
  // Component logic
};

// ❌ Bad examples
interface Props {
  data: any;
  cb1: Function;
  cb2: Function;
}

export const Component = (props: Props) => {
  // Component logic
};
```

### CSS/Styling

- Use Tailwind CSS classes
- Follow mobile-first approach
- Use consistent spacing scale
- Use semantic color names
- Avoid inline styles

```typescript
// ✅ Good examples
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
  <h2 className="text-lg font-semibold text-gray-900">Expenses</h2>
  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
    Add Expense
  </button>
</div>

// ❌ Bad examples
<div style={{ display: 'flex', padding: '16px', backgroundColor: '#fff' }}>
  <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Expenses</h2>
  <button style={{ backgroundColor: '#2563eb', color: 'white' }}>Add Expense</button>
</div>
```

## 🔧 Development Workflow

### Before Starting Work

1. **Check current issues**: Look for existing issues or discussions
2. **Create/assign issue**: Create a new issue or assign yourself to an existing one
3. **Create feature branch**: Follow naming convention
4. **Set up environment**: Ensure local development environment is ready

### During Development

1. **Follow conventions**: Stick to naming and style conventions
2. **Write tests**: Add tests for new functionality
3. **Update documentation**: Keep docs in sync with code changes
4. **Commit frequently**: Make small, focused commits

### Before Submitting PR

1. **Self-review**: Review your own code
2. **Run tests**: Ensure all tests pass
3. **Check linting**: Fix any ESLint or Prettier issues
4. **Update documentation**: Ensure docs reflect changes
5. **Squash commits**: Clean up commit history if needed

## 📋 Checklist for Contributors

### Before Submitting Code

- [ ] Code follows naming conventions
- [ ] Commit messages follow conventional format
- [ ] All tests pass
- [ ] No linting errors
- [ ] Documentation updated
- [ ] Self-review completed
- [ ] Branch name follows convention
- [ ] Issue created/assigned

### Code Review Checklist

- [ ] Code is readable and well-documented
- [ ] No hardcoded values
- [ ] Error handling is appropriate
- [ ] Performance considerations addressed
- [ ] Security best practices followed
- [ ] Accessibility requirements met
- [ ] Cross-browser compatibility considered

---

**Remember**: Consistency is key! Following these conventions makes the codebase more maintainable and helps other contributors understand your code more easily. 🚀
