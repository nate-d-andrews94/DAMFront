# Coding Standards

## Naming Conventions
- camelCase for variables, functions, methods
- PascalCase for classes, interfaces
- UPPER_SNAKE_CASE for constants
- kebab-case for file names

## JavaScript/TypeScript Standards
- Prefer const over let
- Avoid var
- Use async/await instead of callbacks or raw promises
- Use destructuring for objects and arrays
- Use template literals for string interpolation
- Use optional chaining and nullish coalescing

## Error Handling
- Use try/catch blocks for async operations
- Centralize error handling in middleware
- Custom error classes that extend Error
- Include contextual error information
- Log errors with appropriate severity levels

## Function Design
- Pure functions where possible
- Max 20 lines per function
- Max 3 parameters per function
- Use default parameters
- Return early to avoid deep nesting

## Comments and Documentation
- JSDoc for all exports
- Inline comments for complex logic only
- TODO/FIXME for temporary solutions