# DAMFront Developer Guidelines

## Commands (to be implemented)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm test -- -t "test name"` - Run single test

## Code Style
- Variables/Functions: camelCase
- Classes/Interfaces: PascalCase
- Files/Directories: kebab-case
- Max 300 lines per file, 20 lines per function
- Use JSDoc for documentation
- Follow MVC architecture pattern
- Components organized by feature
- Error handling with try/catch and descriptive messages
- Prefer async/await over Promises
- Use strict TypeScript typing (no `any` types)
- Import order: 1) React/external, 2) internal modules, 3) types/styles

## Development Workflow
- Use feature branches
- Run lint and tests before committing
- Commit messages: concise and descriptive
- Follow RESTful API design patterns
- Use React hooks for state management
- Implement TDD when appropriate

Note: Configure ESLint, Prettier, and Jest when setting up the project.