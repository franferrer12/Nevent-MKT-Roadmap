# Contributing to Nevent Strategic Execution Platform

First off, thank you for considering contributing! 🎉

This document provides guidelines for contributing to the project.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)

---

## 🤝 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community

**Unacceptable behavior:**
- Trolling, insulting/derogatory comments
- Public or private harassment
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

---

## 🚀 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When you create a bug report, include as many details as possible:

**Bug Report Template:**
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- Browser: [e.g. Chrome 120]
- OS: [e.g. Windows 11]
- Your role: [admin/editor/viewer]
```

### Suggesting Features

Feature requests are welcome! Please:

1. Check if the feature is already requested
2. Explain why this feature would be useful
3. Provide examples of how it would work

**Feature Request Template:**
```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Any alternative solutions or features.

**Additional context**
Add any other context or screenshots.
```

### Code Contributions

We love pull requests! Here's how:

1. **Fork the repo**
2. **Create a feature branch** (`git checkout -b feat/amazing-feature`)
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with conventional commits** (`git commit -m 'feat: Add amazing feature'`)
6. **Push to your fork** (`git push origin feat/amazing-feature`)
7. **Open a Pull Request**

---

## 💻 Development Setup

### Prerequisites

- Git
- Text editor (VS Code recommended)
- Live Server extension (or Python/Node.js for local server)

### Setup Steps

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/Nevent-MKT-Roadmap.git
cd Nevent-MKT-Roadmap

# 2. Create feature branch
git checkout -b feat/my-feature

# 3. Start development server
# Option A: VS Code Live Server
# Right-click index.html → "Open with Live Server"

# Option B: Python
python -m http.server 8000

# Option C: Node.js
npx http-server
```

### Project Structure

```
index.html          # Main application (1380 lines)
  ├─ Lines 1-640    # CSS (styles)
  ├─ Lines 640-790  # HTML (markup)
  └─ Lines 795-1380 # JavaScript (logic)

/docs               # Documentation
/migrations         # SQL scripts
CLAUDE.md           # AI assistance guide
README.md           # Project readme
```

---

## 📝 Coding Standards

### JavaScript

```javascript
// ✅ DO: Use async/await
async function loadData() {
  const { data, error } = await supabase.from('actions').select('*');
  if (error) console.error(error);
  return data;
}

// ❌ DON'T: Use .then()
function loadData() {
  return supabase.from('actions').select('*').then(...)
}

// ✅ DO: Descriptive names
const currentUser = getUser();
const totalActions = calculateTotal();

// ❌ DON'T: Abbreviations
const usr = getUser();
const tot = calculateTotal();

// ✅ DO: Early returns
function processAction(action) {
  if (!action) return null;
  if (!action.title) return null;
  return action.title.toUpperCase();
}

// ❌ DON'T: Deep nesting
function processAction(action) {
  if (action) {
    if (action.title) {
      return action.title.toUpperCase();
    }
  }
  return null;
}

// ✅ DO: Use const/let
const MAX_RETRIES = 3;
let retryCount = 0;

// ❌ DON'T: Use var
var maxRetries = 3;
```

### CSS

```css
/* ✅ DO: Use CSS custom properties */
:root {
  --accent: #EC008C;
}
.button {
  background: var(--accent);
}

/* ❌ DON'T: Hardcode colors */
.button {
  background: #EC008C;
}

/* ✅ DO: BEM-like naming */
.action-card {}
.action-card__title {}
.action-card--highlighted {}

/* ❌ DON'T: Generic names */
.card {}
.title {}
```

### HTML

```html
<!-- ✅ DO: Semantic HTML -->
<header>...</header>
<main>...</main>
<footer>...</footer>

<!-- ❌ DON'T: Divs for everything -->
<div class="header">...</div>
<div class="main">...</div>

<!-- ✅ DO: Accessibility -->
<button aria-label="Close modal">×</button>
<img src="logo.svg" alt="Nevent logo">

<!-- ❌ DON'T: Missing ARIA/alt -->
<div onclick="close()">×</div>
<img src="logo.svg">
```

---

## 🎯 Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `style` - Formatting, missing semicolons
- `refactor` - Code change that neither fixes a bug nor adds a feature
- `perf` - Performance improvement
- `test` - Adding tests
- `chore` - Updating build tasks, package manager configs

### Examples

```bash
# Feature
git commit -m "feat: Add OKR creation modal"
git commit -m "feat(dashboard): Add health score indicator"

# Bug fix
git commit -m "fix: Resolve login redirect loop"
git commit -m "fix(subtasks): Fix toggle not saving"

# Documentation
git commit -m "docs: Update API reference"
git commit -m "docs(readme): Add screenshots"

# Breaking change
git commit -m "feat!: Migrate roadmap_actions to actions table

BREAKING CHANGE: Actions table requires initiative_id"
```

---

## 🔄 Pull Request Process

### Before Submitting

1. **Test your changes** thoroughly
2. **Update documentation** if needed
3. **Run manual tests** (checklist in Development Guide)
4. **Update CHANGELOG.md** with your changes
5. **Ensure commits follow conventions**

### PR Title Format

```
<type>: <short description>

Examples:
feat: Add OKR creation modal
fix: Resolve login redirect issue
docs: Update deployment guide
```

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
Describe the tests you ran:
- [ ] Tested login flow
- [ ] Tested CRUD operations
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] Tested on mobile

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] I have updated CHANGELOG.md
- [ ] My changes generate no console errors
- [ ] I have tested in at least 2 browsers
```

### Review Process

1. **Automated checks** will run (if CI/CD configured)
2. **Maintainer review** (usually within 48 hours)
3. **Address feedback** if requested
4. **Approval and merge** by maintainer

---

## 🐛 Issue Reporting

### Good Issue Example

```markdown
**Title:** Login fails with valid credentials

**Description:**
When I try to login with correct email/password, I get "Invalid credentials" error.

**Steps to Reproduce:**
1. Go to https://franferrer12.github.io/Nevent-MKT-Roadmap/
2. Enter email: test@nevent.es
3. Enter password: test123
4. Click "Iniciar Sesión"
5. See error message

**Expected Behavior:**
Should successfully login and show main dashboard.

**Actual Behavior:**
Shows "Invalid login credentials" error.

**Environment:**
- Browser: Chrome 120.0.6099.71
- OS: Windows 11
- Role: Editor
- Date: 2025-09-30

**Screenshots:**
[Attach screenshot]

**Console Errors:**
```
Error: Invalid login credentials
  at handleLogin (index.html:825)
```

**Additional Context:**
This started happening after the v3.0.0 update.
```

### Bad Issue Example

```markdown
**Title:** Login broken

**Description:**
Login doesn't work.

**Steps:**
Try to login.

**Expected:**
Should work.
```

---

## 🏷️ Labels

We use these labels to organize issues:

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `priority: high` - Critical issue
- `priority: medium` - Important but not urgent
- `priority: low` - Nice to have

---

## 📚 Documentation Guidelines

When updating documentation:

1. **Keep it concise** - Short paragraphs, bullet points
2. **Use examples** - Code snippets and screenshots
3. **Update CHANGELOG.md** - Track changes
4. **Check links** - Ensure all links work
5. **Use proper Markdown** - Consistent formatting

---

## 🎓 Learning Resources

New to contributing? Check these out:

- [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
- [First Contributions](https://github.com/firstcontributions/first-contributions)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

---

## 💡 Questions?

- **General questions:** Open a [Discussion](https://github.com/franferrer12/Nevent-MKT-Roadmap/discussions)
- **Bug reports:** Open an [Issue](https://github.com/franferrer12/Nevent-MKT-Roadmap/issues)
- **Private questions:** Email fran.ferrer@nevent.es

---

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Special shoutout in changelog

---

**Thank you for contributing! 🚀**

**Maintained by:** fran.ferrer@nevent.es
**Last Updated:** September 30, 2025