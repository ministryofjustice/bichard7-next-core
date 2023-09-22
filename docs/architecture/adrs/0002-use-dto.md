# 1. Record architecture decisions

Date: 2023-09-222

## Status

Pending

## Context

Using a Data Transfer Object (DTO) in the `bichard-next-ui` repo will help separate the User Interface (React) from
the Database objects. It will also allow to use TypeScript more effectively, enforcing stricter types on objects at
compile time.

We have chosen the naming convention of:

- Types:
  - `Display` - Prefix for the object to be consumed in the UI
  - `DisplayPartial` - Prefix for the object which has limited fields
  - `DisplayFull` - Prefix for the object which has all fields (that aren't a security risk)
- File structure for DTOs
  - `src/services/dto` top level
  - Then for example: `objectDto.ts`
- Which holds functions like:
  - `objToDisplayObjDto`
  - `objToDisplayPartialObjDto`

A DTO object is a new object mirror with some of a Entity's attributes. We are actively using `Pick<T, "field">` to
select what we want to use out of the Entity and mapping via a function (e.g.
`const displayObj = objToDisplayObjDto(obj)`).

We can control the levels of data we want share. E.g. `displayPartialObj` or `displayFullObj`.

## Consequences

- It's more complex than just using the Database Record
- You have to be disciplined in it's use and following the architectural pattern
