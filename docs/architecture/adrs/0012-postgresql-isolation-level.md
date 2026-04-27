# 12. PostgreSQL Isolation Level

Date: 2026-04-24

## Status

Accepted

## Context

We were using `SERIALIZABLE`, PostgreSQL's strictest isolation level. This caused frequent serialization failures in the
UI even with a retry function in place, adding complexity without meaningful benefit given our user base. We do not use
`SERIALIZABLE` elsewhere in the project.

## Decision

Use `READ COMMITTED`, PostgreSQL's default isolation level, for all transactions going forward. Explicit pessimistic
locking (`SELECT FOR UPDATE`) will be used where race conditions are a genuine concern (e.g. case locking).

## Consequences

- Eliminates the need for a transaction retry function
- Reduces complexity and aligns isolation level usage across the project
- **Accepted Risk:** `READ COMMITTED` does not protect against non-repeatable reads, phantom reads, or serialization
  anomalies. This is accepted as low risk at our scale.
- **Shift to Blocking:** Race conditions (e.g., case locking) are now mitigated at the query level. Concurrent requests for
  the same resource will wait in a queue rather than failing and retrying.
- **Deadlocks and Latency:** Because `SELECT FOR UPDATE` blocks concurrent transactions, we must ensure transactions are
  kept short to avoid tying up the database connection pool, and that locks are acquired in a consistent order to prevent
  deadlocks.
