# 5. Using External Libraries

Date: 2024-06-25

## Status

Pending

## Context

To ensure rapid delivery without reinventing the wheel, we will utilize external libraries and leverage existing solutions for complex problems. While these libraries provide substantial benefits, it's essential to establish guidelines to ensure a shared understanding of when to use external libraries and when to avoid them. Transitive dependencies can introduce underlying security vulnerabilities, increase the risk of dependency conflicts, and complicate the upgrade and maintenance processes.

## Decision

- We will only consider well-established libraries that are actively maintained and expected to have long-term support.
- Libraries should have a proven track record of stability and regular updates, with a robust community or organizational backing to ensure continued maintenance and support.
- To maintain simplicity and control over our codebase, we will avoid using external libraries for problems that can be solved internally with minimal effort and maintenance. For instance, we decided to create our own [AutoSave component](https://github.com/ministryofjustice/bichard7-next-ui/blob/main/src/components/EditableFields/AutoSave.tsx) for this reason.
- Libraries with minimal dependencies are preferred (use `npm ls` to view dependency graph e.g `npm ls --all` or `npm ls sass`)

## Consequences

- By adopting well-established and maintained libraries with minimal dependencies, we enhance the security and stability of our projects and reduce the risk of vulnerabilities and maintenance issues.
