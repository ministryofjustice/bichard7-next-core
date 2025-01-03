# 8. API Design

Date: 2024-12-18

## Status

Accepted

## Context

We want the API to be well-designed and consistent. To achieve this we are proposing the following approach which lays out some of the key design decisions when building an API:

### RESTful API First

We will aim to use a RESTful approach as our primary design for the API. This means:

- Using HTTP verbs to represent actions
- Modelling our domain objects in the API, e.g. `/cases`

There may be times when an RPC approach is more suited to particular operations, expecially if they involve transactional constraints or coordinate a number of separate operations. In this case we will allow a hybrid ReST / RPC approach, e.g. `/cases/:caseId/resubmit`

### Versioning

It's always easier to add versioning into the API in the beginning, therefore we will include a version in the URL, e.g. `/v1/cases`

### Representation of data

We are using JSON to serialise our data and should apply the following conventions:

- Use camelCase for attributes in the JSON data, e.g. `courtHouse`
- Where the endpoint returns more than one record, we should have a root object which also contains pagination data

### URL Design

We will apply the following rules to designing URLs in the API:

- Use lowercase separate words with hyphens for path segments, e.g. `/court-cases`
- Use snake_case words for query parameters, e.g. `/cases?per_page=20`
- Pluralise resource names, e.g. `/cases`
- Avoid trailing slashes
- Use nesting if the resource should only be available via its parent, e.g. `/cases/:caseId/triggers`

## Consequences

- Setting out these design guidelines in advance means we will be more likely to end up with a consistent API design
