import type { CreateAuditInput } from "@moj-bichard7/common/contracts/CreateAuditInput"
import getDataSource from "../../src/services/getDataSource"
import { format, subWeeks } from "date-fns"

export const insertAuditWithOverrides = async (
  overrides: Partial<CreateAuditInput>,
  caseIds: number[],
  username: string
): Promise<void> => {
  const { fromDate, includedTypes, resolvedByUsers, toDate, volumeOfCases, triggerTypes }: CreateAuditInput = {
    fromDate: format(subWeeks(new Date(), 1), "yyyy-MM-dd"),
    includedTypes: ["Triggers", "Exceptions"],
    resolvedByUsers: ["user1"],
    toDate: format(new Date(), "yyyy-MM-dd"),
    volumeOfCases: 20,
    ...overrides
  }
  const dataSource = await getDataSource()

  await dataSource.transaction(async (tx) => {
    const [{ audit_id: auditId }] = await tx.sql<{ audit_id: number }[]>`
      INSERT INTO br7own.audits (
        created_by,
        created_when,
        from_date,
        to_date,
        included_types,
        resolved_by_users,
        trigger_types,
        volume_of_cases
      )
      VALUES (
        ${username},
        CURRENT_DATE,
        ${fromDate},
        ${toDate},
        ${includedTypes},
        ${resolvedByUsers},
        ${triggerTypes ?? null},
        ${volumeOfCases}
      )
      RETURNING *
    `

    await tx.sql`
      INSERT INTO br7own.audit_cases (audit_id, error_id)
      SELECT ${auditId}, error_id
      FROM UNNEST(${caseIds}::int[]) AS t(error_id)
      RETURNING *
    `
  })
}
