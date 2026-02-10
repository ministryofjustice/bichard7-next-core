import { CardRow, StatCard, CardLabel, CardValue } from "./ProgressCardsAuditStatus.styles"

interface AuditStatusProps {
  passCount?: number
  failCount?: number
  totalCases?: number
}

export const ProgressCardsAuditStatus = ({ failCount = 0, passCount = 0, totalCases = 0 }: AuditStatusProps) => {
  const remainingValue = Math.max(totalCases - (failCount + passCount), 0)

  const stats = [
    { label: "Failed", value: failCount, variant: "fail" },
    { label: "Passed", value: passCount, variant: "pass" },
    { label: "Remaining", value: remainingValue, variant: "remaining" }
  ] as const

  const statSummaries = stats.map(({ value, label }) => `${value} ${label.toLowerCase()}`)

  const srSummary = `${statSummaries.join(", ")} out of ${totalCases} total audits.`

  return (
    <section aria-label="Audit progress summary">
      <span className="govuk-visually-hidden">{srSummary}</span>

      <CardRow aria-hidden="true">
        {stats.map(({ label, value, variant }) => (
          <StatCard key={variant} $variant={variant}>
            <CardValue>{value}</CardValue>
            <CardLabel>{label}</CardLabel>
          </StatCard>
        ))}
      </CardRow>
    </section>
  )
}
