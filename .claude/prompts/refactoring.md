# Refactoring Guide

When refactoring code, please follow these steps:

1. **Identify Goals**
   - What specific problems are being addressed?
   - How will this refactoring improve the codebase?
   - What metrics will indicate success?

2. **Pre-Refactoring Steps**
   - Ensure comprehensive test coverage exists
   - Document current behavior precisely
   - Consider breaking large refactorings into smaller steps

3. **Implementation Steps**
   - Make incremental changes that can be tested individually
   - Follow the boy scout rule: leave code better than you found it
   - Update tests as needed while maintaining coverage
   - Maintain the same external behavior

4. **Verification**
   - Confirm all tests still pass
   - Verify no new bugs were introduced
   - Document architectural changes for the team
