# 7. API Authentication and Authorisation Approach

Date: 2024-10-21

## Status

Pending

## Context

We want the API to be secure, so we need Authentication and Authorisation. To maintain consistency throughout the
service, we will use the same tokens and secrets as the front end to verify the token and ensure it is correct.

Although the primary use case is to handle requests coming from the UI made by end users, we also want to be able to
handle service requests, e.g.

- Core creating records for exceptions and triggers
- The resubmission service resubmitting PNC failures

### Authentication and Authorisation

This is handled by the `Authorisation` header with a `Bearer` token. The bearer token will be validated to demonstrate
that the request is authenticated. When a service-to-service request is required and not on a user's behalf, we will
generate a bearer token for that service.

The token is in the format of a [JWT](https://jwt.io/) and contains the user's or service information to verify what the
token can and cannot do.

## Consequences

- A developer needs to understand:
  - JWT and how they can be used
  - The Bichard user permission model
