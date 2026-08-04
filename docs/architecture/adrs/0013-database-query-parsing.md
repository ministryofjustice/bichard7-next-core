# 13. Database Query Parsing

Date: 2026-08-04

## Status

Accepted

## Context

We have found issues where the data types being returned from SQL queries on our Postgres database were not
matching our expected types. This hasn't lead to any known runtime issues but it reduces confidence in our type checking
and will lead to a real bug eventually. 

At the moment we simply tell TypeScript what type the query is returned, but this is not actually validated.

```typescript
const results = sql<{ field1: number }[]>`SELECT 'hello' as field1 FROM my_table`
```

In the above example, TypeScript will see the value of `field1` as being of type `number` but at runtime it will be a `string`.

## Decision

Use Zod parsing on all SQL queries to ensure data types are validated at runtime. This should also mean that we get failing tests so 
we should catch these issues at design time.

Example:

```typescript
import { z } from "zod"

const MyTableSchema = z.object({ field1: z.string() })

const results = sql`SELECT 'hello' as field1 FROM my_table`

const parsedResults = z.array(MyTableSchema).safeParse(results)
if (!parsedResults.success) {
  return new Error("Schema validation failed for query")
}

parsedResults // This will be inferred as type `{ field1: string }[]`
```

## Consequences

- Ensures greater confidence in our type checking
- Allows us to catch subtle bugs in our database queries before they end up in production
- Marginal overhead added to database calls now that we are parsing all of the data being returned. On large result sets we could potentially have some performance issues
