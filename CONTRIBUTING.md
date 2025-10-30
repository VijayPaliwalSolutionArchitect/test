# Contributing to SIS Mobile

Thank you for your interest in contributing to SIS Mobile! This document provides guidelines and instructions for contributing.

## 📋 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other contributors

## 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/sis-mobile-app.git
   ```
3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 💻 Development Guidelines

### Code Style

- **TypeScript**: Use strict type checking
- **Linting**: Run `npm run lint` before committing
- **Formatting**: Use Prettier (`npm run format`)
- **Naming Conventions**:
  - Components: PascalCase (e.g., `UserProfile.tsx`)
  - Functions/Variables: camelCase (e.g., `getUserData`)
  - Constants: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
  - Files: kebab-case for utilities (e.g., `format-date.ts`)

### Project Structure

```
src/
  ├── api/          # API configuration and clients
  ├── components/   # Reusable UI components
  ├── features/     # Feature-specific modules
  ├── hooks/        # Custom React hooks
  ├── screens/      # Screen components
  ├── services/     # External service integrations
  ├── store/        # Redux store and slices
  ├── types/        # TypeScript type definitions
  └── utils/        # Utility functions
```

### Commit Messages

Follow conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add biometric login support
fix(attendance): correct date filtering logic
docs(readme): update installation instructions
```

## 🧪 Testing

### Before Submitting

- [ ] Code compiles without errors
- [ ] All tests pass: `npm test`
- [ ] TypeScript checks pass: `npm run type-check`
- [ ] Linter passes: `npm run lint`
- [ ] App runs on both iOS and Android
- [ ] No console errors or warnings

### Writing Tests

```typescript
// Example test
import { render, screen } from '@testing-library/react-native';
import LoginScreen from '@/screens/auth/LoginScreen';

describe('LoginScreen', () => {
  it('renders login form', () => {
    render(<LoginScreen />);
    expect(screen.getByPlaceholderText('Email or Phone')).toBeTruthy();
  });
});
```

## 📝 Pull Request Process

1. **Update Documentation**: If you add features, update README.md
2. **Add Tests**: Include tests for new functionality
3. **Update Types**: Add/update TypeScript types
4. **Run Checks**: Ensure all automated checks pass
5. **Create PR**: Use the PR template
6. **Code Review**: Address reviewer feedback
7. **Merge**: Maintainer will merge after approval

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
- [ ] Tested on iOS
- [ ] Tested on Android
- [ ] Added unit tests
- [ ] Manual testing completed

## Screenshots (if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings
```

## 🐛 Reporting Bugs

Use GitHub Issues with the bug template:

**Required Information:**
- Device/OS version
- App version
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/logs

## 💡 Feature Requests

Use GitHub Issues with the feature request template:

**Required Information:**
- Problem statement
- Proposed solution
- Alternatives considered
- Additional context

## 🏗 Architecture Guidelines

### State Management

- Use Redux Toolkit for global state
- Use RTK Query for server state
- Use local state for UI-only concerns
- Keep state normalized

### API Integration

- All API calls through RTK Query
- Handle loading/error states
- Implement optimistic updates
- Cache responses appropriately

### Styling

- Use centralized theme (`theme.config.ts`)
- Follow design system tokens
- Use StyleSheet for performance
- Support dark mode

### Performance

- Optimize FlatList with keys and memoization
- Lazy load screens
- Optimize images
- Monitor bundle size

## 📚 Resources

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🙏 Thank You!

Every contribution helps make SIS Mobile better. We appreciate your time and effort!

---

**Questions?** Reach out via GitHub Issues or email: support@shivamitcs.in
