import type { ReportConfig, ReportData } from "types/reports/Config"

// We must explicitly narrow the config type in this switch block so TypeScript
// can safely distribute the discriminated union into the ReportData object.
// Do not refactor this into a single `reportData = { config, rows }` assignment!
export default function bundleReportData(
  config: ReportConfig | null,
  rows: Record<string, unknown>[] | null
): ReportData | null {
  if (!config || !rows) {
    return null
  }

  switch (config.structure) {
    case "flat":
      return { config, rows }
    case "grouped":
      return { config, rows }
    case "nested":
      return { config, rows }
    default:
      return null
  }
}
