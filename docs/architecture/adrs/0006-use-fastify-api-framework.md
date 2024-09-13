# 6. Use [Fastify](https://fastify.dev/) API framework

Date: 2024-09-13

## Status

Accepted

## Context

As a team who are significantly invested in both [TypeScript](https://www.typescriptlang.org/) and [Zod](https://zod.dev/) for type safety both in development and at runtime, choosing technologies that provide first class support for these tools provides numerous benefits to the team:

- Simplified developer experience
- Succinct and easily digestible code
- Shorter delivery time for features

Our current web framework for the API is [Express](https://expressjs.com/). [Express](https://expressjs.com/) is a well supported, widely used framework that can be effectively used to build APIs. Given that our API is currently under development and isn't actively used in production, there isn't much code to change in order to change the web framework.

We are proposing to remove [Express](https://expressjs.com/) in order to utilise [Fastify](https://fastify.dev/), primarily on the basis that both frameworks can be effectively used to build APIs, but that [Fastify](https://fastify.dev/) provides first-class support for [TypeScript](https://www.typescriptlang.org/), [Zod](https://zod.dev/) and [OpenAPI](https://www.openapis.org/) document generation out of the box.

The decision to suggest [Fastify](https://fastify.dev/) results from having reviewed a number of web frameworks against our team's operational context - namely [NextJS](https://nextjs.org/) (as it is used elsewhere in the project), [Encore](https://encore.dev/) (because it has a good reputation for developer experience), [Fastify](https://fastify.dev/) and [Express](https://expressjs.com/) itself.

Having performed a few basic spikes to test the functionality and usability of each library with [Zod](https://zod.dev/), [TypeScript](https://www.typescriptlang.org/) and [OpenAPI](https://www.openapis.org/) document generation, both [Fastify](https://fastify.dev/) and [Encore](https://encore.dev/) performed above [NextJS](https://nextjs.org/) and [Express](https://expressjs.com/), but [Encore](https://encore.dev/) unfortunately takes too much responsibility for the resulting Docker image (no ability to edit the Dockerfile) for the service, which isn't a measure of control we're willing to give away.

## Decision

Using principles for library adoption established in **ADR0005**, this is how we justify the decision.

- [Fastify](https://fastify.dev/) reached v1 in October, 2018. Throughout the package's history, it has releases almost every month and has a consistent group of maintainers contributing to the project on a regular basis. The project is hosted by the OpenJS foundation and provides an LTS schedule on their website.
- [Fastify](https://fastify.dev/) has fewer dependencies than [Express](https://expressjs.com/).

## Consequences

- Adopting [Fastify](https://fastify.dev/) will improve the developer experience for the API project, it will provide a web framework that is fast and well optimised and it will provide first class support within the API project for strong typing and accurate documentation.
- Developers will need to learn a new web framework, which will incur an operational cost.
- Developers will need to be able to work with [Zod](https://zod.dev/) in order to build new features on the API.
