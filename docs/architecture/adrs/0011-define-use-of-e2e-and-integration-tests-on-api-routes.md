# 11. Define use of e2e and integration tests on API routes

Date: 2026-02-16

## Status

Accepted

## Context

Currently, we have 2 methods of testing our API routes:

- e2e tests use the node `fetch` API to test the endpoint and therefore go through the network layer
- Integration tests use Fastify's `app.inject` functionality to test the endpoint and do not therefore go through the network layer

### Issue

We are often duplicating the same tests in both our e2e and integration suites. This offers us no additional value and takes up extra time to both write and also run in our CI pipeline

### Solution

- Route integration tests should test all business logic such as validation, user permissions and also ensuring that data is present in the database and the response contains the data we expect. They should make calls to the endpoint using Fastify's `app.inject` feature.
- Route e2e tests should be happy path smoke tests only. Often this will mean only 1 e2e test per endpoint. It should make the request using the `fetch` API and just check the response code with a simple check on the response body.

## Consequences

- Eliminates redundant test cases across suites
- Fewer tests to maintain
- Improved CI pipeline speed - e2e are slower as they need to spin up an actual server so having most of the tests in the integration test suite will improve speed of testing
