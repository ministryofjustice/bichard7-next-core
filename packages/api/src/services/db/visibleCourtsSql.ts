import type postgres from "postgres"
import type { Row } from "postgres"

import type { DatabaseConnection } from "../../types/DatabaseGateway"

export const visibleCourtsSql = (
  database: DatabaseConnection,
  visibleCourts: string[]
): postgres.PendingQuery<Row[]> => {
  if (visibleCourts.length === 0) {
    return database.connection`FALSE`
  }

  const queries: postgres.PendingQuery<Row[]>[] = []
  visibleCourts.forEach((vc, i) => {
    if ((i === 0 && visibleCourts.length === 1) || i + 1 === visibleCourts.length) {
      queries.push(database.connection`el.court_code LIKE ${vc + "%"}`)
    } else {
      queries.push(database.connection`el.court_code LIKE ${vc + "%"} OR`)
    }
  })

  const query = queries.map((q) => database.connection`${q}`)

  return database.connection`${query}`
}
