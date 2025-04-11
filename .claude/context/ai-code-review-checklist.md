# AI Code Review Checklist

## Security
- [ ] No hardcoded credentials
- [ ] Input validation for all user inputs
- [ ] SQL/NoSQL injection prevention
- [ ] XSS prevention measures

## Performance
- [ ] No N+1 queries
- [ ] Appropriate indexing specified
- [ ] Avoid memory leaks
- [ ] Consider pagination for large datasets

## Code Quality
- [ ] Follows project coding standards
- [ ] No duplicated code
- [ ] Clear naming
- [ ] Appropriate error handling

## Testing
- [ ] Unit tests for business logic
- [ ] Integration tests for API endpoints
- [ ] Edge cases covered
- [ ] Mocking of external dependencies