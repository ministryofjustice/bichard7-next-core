import type postgres from "postgres"
import type { Row } from "postgres"

export const visibleCourtsSql = (sql: postgres.Sql, visibleCourts: string[]): postgres.PendingQuery<Row[]> => {
  if (visibleCourts.length === 0) {
    return sql`FALSE`
  }

  const queries: postgres.PendingQuery<Row[]>[] = []
  visibleCourts.forEach((vc, i) => {
    if ((i === 0 && visibleCourts.length === 1) || i + 1 === visibleCourts.length) {
      queries.push(sql`el.court_code LIKE ${vc + "%"}`)
    } else {
      queries.push(sql`el.court_code LIKE ${vc + "%"} OR`)
    }
  })

  const query = queries.map((q) => sql`${q}`)

  return sql`${query}`
}
