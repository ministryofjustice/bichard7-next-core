import type Database from "types/Database"
import type PromiseResult from "types/PromiseResult"
import type User from "types/User"

export default async (db: Database, emailAddress: string): PromiseResult<User | null> => {
  const query = `
      SELECT
        id,
        username,
        email AS "emailAddress",
        endorsed_by AS "endorsedBy",
        org_serves AS "orgServes",
        forenames,
        surname,
        feature_flags AS "featureFlags",
        visible_courts AS "visibleCourts",
        visible_forces AS "visibleForces",
        excluded_triggers AS "excludedTriggers"
      FROM br7own.users
      WHERE LOWER(email) = LOWER($1) AND deleted_at IS NULL
    `
  return db.oneOrNone<User>(query, [emailAddress]).catch((error) => error)
}
