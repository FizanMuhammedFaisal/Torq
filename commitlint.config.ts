const config = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        // Type must be one of the conventional types
        'type-enum': [
            2,
            'always',
            [
                'feat',     // New feature
                'fix',      // Bug fix
                'docs',     // Documentation only
                'style',    // Code style (formatting, semicolons, etc)
                'refactor', // Code change that neither fixes a bug nor adds a feature
                'perf',     // Performance improvement
                'test',     // Adding or updating tests
                'build',    // Build system or dependencies
                'ci',       // CI configuration
                'chore',    // Other changes (e.g. updating .gitignore)
                'revert',   // Revert a commit
            ],
        ],
        // Subject (commit message) rules
        'subject-case': [2, 'always', 'lower-case'],
        'subject-empty': [2, 'never'],
        'subject-max-length': [2, 'always', 72],
        // Type rules
        'type-case': [2, 'always', 'lower-case'],
        'type-empty': [2, 'never'],
        // Scope rules (optional scope)
        'scope-case': [2, 'always', 'lower-case'],
        // Body rules
        'body-max-line-length': [2, 'always', 100],
    },
    prompt: {
        questions: {
            type: {
                description: "Select the type of change you're committing:",
                enum: {
                    feat: {
                        description: 'A new feature',
                        title: 'Features',
                        emoji: '✨',
                    },
                    fix: {
                        description: 'A bug fix',
                        title: 'Bug Fixes',
                        emoji: '🐛',
                    },
                    docs: {
                        description: 'Documentation only changes',
                        title: 'Documentation',
                        emoji: '📚',
                    },
                    style: {
                        description: 'Code style changes (formatting, semicolons, etc)',
                        title: 'Styles',
                        emoji: '💎',
                    },
                    refactor: {
                        description: 'Code change that neither fixes a bug nor adds a feature',
                        title: 'Code Refactoring',
                        emoji: '📦',
                    },
                    perf: {
                        description: 'Performance improvement',
                        title: 'Performance',
                        emoji: '🚀',
                    },
                    test: {
                        description: 'Adding or updating tests',
                        title: 'Tests',
                        emoji: '🧪',
                    },
                    build: {
                        description: 'Build system or external dependencies',
                        title: 'Builds',
                        emoji: '🛠',
                    },
                    ci: {
                        description: 'CI configuration files and scripts',
                        title: 'CI',
                        emoji: '⚙️',
                    },
                    chore: {
                        description: "Other changes that don't modify src or test files",
                        title: 'Chores',
                        emoji: '♻️',
                    },
                    revert: {
                        description: 'Reverts a previous commit',
                        title: 'Reverts',
                        emoji: '🗑',
                    },
                },
            },
            scope: {
                description: 'Scope of this change (e.g. api, web, operator):',
            },
            subject: {
                description: 'Short description of the change:',
            },
            body: {
                description: 'Longer description (optional):',
            },
            isBreaking: {
                description: 'Are there any breaking changes?',
            },
            issues: {
                description: 'Issue references (e.g. "closes #123"):',
            },
        },
    },
};

export default config;
