# 5. Use Fastify API framework

Date: 2024-09-13

## Status

Pending

## Context

As a team who are significantly invested in both TypeScript and Zod for type safety both in development and at runtime, choosing technologies that provide first class support for these tools provides numerous benefits to the team:

- Simplified developer experience
- Succinct and easily digestible code
- Shorter delivery time for features

Our current web framework for the API is Express. Express is a well supported, widely used framework that can be effectively used to build APIs.

We are proposing to remove Express in order to utilise Fastify, primarily on the basis that both frameworks can be effectively used to build APIs, but that Fastify provides first-class support for TypeScript, Zod and OpenAPI document generation out of the box.

The decision to suggest Fastify results from having reviewed a number of web frameworks against our team's operational context - namely NextJS (as it is used elsewhere in the project), Encore (because it has a good reputation for developer experience), Fastify and Express itself.

Having performed a few basic spikes to test the functionality and usability of each library with Zod, TypeScript and OpenAPI document generation, both Fastify and Encore performed above NextJS and Express, but Encore unfortunately takes too much responsibility for the resulting Docker image (no ability to edit the Dockerfile) for the service, which isn't a measure of control we're willing to give away.

## Decision

Using principles for library adoption established in ADR0005, this is how we justify the decision.

- Fastify reached v1 in October, 2018. Throughout the package's history, it has releases almost every month and has a consistent group of maintainers contributing to the project on a regular basis. The project is hosted by the OpenJS foundation and provides an LTS schedule on their website.
- Fastify has fewer dependencies than Express.

## Consequences

- Adopting Fastify will improve the developer experience for the API project, it will provide a web framework that is fast and well optimised and it will provide first class support within the API project for strong typing and accurate documentation.