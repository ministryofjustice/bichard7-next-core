import type { Case } from "@moj-bichard7/common/types/Case"
import type postgres from "postgres"

export default async (sql: postgres.Sql, caseId: number, forceIds: number[]): Promise<Case> => {
  const [result]: [Case?] = await sql`
      SELECT *
      FROM br7own.error_list el
      WHERE
        el.error_id = ${caseId} AND
        br7own.force_code(el.org_for_police_filter) = ANY(${forceIds}::SMALLINT[])
    `

  if (!result) {
    throw new Error("Case not found")
  }

  return result
}
