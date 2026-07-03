export const convertCasesToAudit = (rows: Record<string, unknown>[]) =>
  rows.map((row) => ({
    errorId: row.error_id,
    errorQualityChecked: row.error_quality_checked,
    errorResolvedBy: row.error_resolved_by,
    triggerQualityChecked: row.trigger_quality_checked,
    triggerResolvedBy: row.trigger_resolved_by
  }))
