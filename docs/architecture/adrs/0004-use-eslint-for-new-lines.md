# 4. ESLint rule for newline after control flow blocks

Date: 2024-05-23

## Status

Accepted

## Context

This Pull Request introduces a new ESLint rule that enforces the addition of a newline after control flow blocks (e.g., `if`, `for`, `while`, `switch`). This rule aims to maintain consistent code formatting and enhance code readability across our codebase.

We have been following the convention of adding newlines after control flow blocks to improve code readability and formatting. However, this practice has been manually enforced, leading to potential inconsistencies. By introducing this ESLint rule, we can ensure that the linter automatically checks for this convention, streamlining the process and promoting a consistent coding style.

## Consequences

- ESLint might slow us down when committing changes if we have to fix files
- ESLint might be too aggressive when it comes to applying the changes
