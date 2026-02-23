# 10. API Contracts Naming Conventions

Date: 2026-02-16

## Status

Accepted

## Context

We want the schemas and types used for our API routes to be named consistently and be located in a directory that is easy to find. The naming should also be descriptive, you should be able to tell what a schema/type is used for at a glance.

### Naming Convention

- Schemas/types for `GET` endpoints should be in the format `<entity>QuerySchema`/`<entity>Query`. E.g. `CasesQuerySchema`/`CasesQuery`
- Schemas/types for `POST`/`PUT` endpoints should be in the format `<action><entity>InputSchema`/`<action><entity>Input`. E.g:
  - `CreateAuditInputSchema`/`CreateAuditInput`
  - `CompleteAuditInputSchema`/`CompleteAuditInput`

### Storage Location

- These schemas/types should live in the `packages/common/types/contracts` folder
- They need to live in the common package so they can be used in the API and the UI

## Consequences

- Setting out these guidelines should mean we have improved consistency. It will mean going through the existing types though and correcting these.
