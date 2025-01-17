# 9. Naming of Types and Schemas

Date: 2025-01-16

## Status

Pending

## Context

We want to leverage [Zod's](https://zod.dev/) ability to validate schemas and turn the schemas into objects. This is
especially helpful whilst build the API as we can auto generate Swagger documentation for API calls (parameters,
requests and responses).

We also want to have a clear and concise naming convention for the Schemas and Types that the Zod schemas will create.

Types should be context and use case based, using `Pick<Case, CaseData>`, for example. It leads to not having to define
the Type in the Common package. This should be considered as an intermediate type, only to be used in this context and
not to be used outside the use case. The type should be clearly named for the use case to be involved with e.g.
`CaseDataForDto` which contains only the attributes needed for that conversion (from the database to DTO).

For example:

- Case (database representation) -> CaseDataForDto (picked fields for database query) -> CaseDto (data transform object
  to send to the external services e.g. UI)
- Trigger -> TriggerDto

The following guidelines should help in creating a good name structure as well looking at the API package code.

### Names we will expect

- `Schema` as a suffix to Zod Schema
- `Dto` as a suffix to a Type which has been convert from a database object to a domain object
- Strict camel case, for files and functions

### Names we find acceptable

- Try to avoid unnecessary suffixes
- If you can't define an object using what it represents try either these suffixes:
  - Object as aggregate `Data` e.g. has relations as part of the dataset
  - Object is a pure database row `Row` e.g. no relations is part of the dataset
- Try to create Types that are close to domain, context and use case

### Names we want to avoid using

- Lots of adjectives in a name
- `Full`, `Partial`, `Raw`, `DB`

## Decision

Pending

## Consequences

We will have to carefully choose names that are meaningful. That may slow down our velocity. But this will be good trade
off for the readability and maintainability for Bichard.
