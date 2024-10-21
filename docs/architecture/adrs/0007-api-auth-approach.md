# 7. API Authentication and Authorisation Approach

Date: 2024-10-21

## Status

Pending

## Context

We want the API to be secure so we need to Authentication and Authorisation. We rely on the `nginx auth proxy` and the
`bichard-next-user-service` to verify a user's interaction with UI server.

### Authentication

This is handled by the `X-API-Key` header. This is to verify that the UI server can "talk" to the API server.

### Authorisation

This is handled by the `Authorisation` header with a `Bearer` token. This token is in the format of a
[JWT payload](https://jwt.io/) (encoded) from the UI and contains the user's information so we can verify what the user
can and cannot do.

## Consequences

- A developer needs to understand:
  - JWT and how they can be used
  - how the `nginx auth proxy` works
  - how the `bichard-next-user-service` works
