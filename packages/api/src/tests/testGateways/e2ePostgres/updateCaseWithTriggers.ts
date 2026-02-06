import type postgres from "postgres"

export default async function (
  sql: postgres.Sql,
  caseId: number,
  triggerResolvedBy: null | string,
  triggerResolvedAt: Date | null,
  triggerCount: number,
  triggerStatus: number,
  triggerReason: string
) {
  await sql`
    UPDATE br7own.error_list
    SET
      trigger_resolved_by = ${triggerResolvedBy},
      trigger_resolved_ts = ${triggerResolvedAt},
      trigger_count = trigger_count + ${triggerCount},
      trigger_reason = ${triggerReason},
      trigger_status = ${triggerStatus}
    WHERE error_id = ${caseId}
  `
}
