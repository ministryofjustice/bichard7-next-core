import type { User } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"
import type { Row } from "postgres"

import type { DatabaseConnection } from "../../types/DatabaseGateway"

import { visibleCourtsSql } from "./visibleCourtsSql"
import { visibleForcesSql } from "./visibleForcesSql"

export const organisationUnitSql = (database: DatabaseConnection, user: User): postgres.PendingQuery<Row[]> => {
  return database.connection`${visibleCourtsSql(database, user.visibleCourts)} OR ${visibleForcesSql(database, user.visibleForces)}`
}
