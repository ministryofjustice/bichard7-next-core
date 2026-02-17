import { CardRow, StatCard, CardCount } from "./ProgressCardsAuditStatus.styles"

interface AuditStatusProps {
  passCount?: number
  failCount?: number
  totalCases?: number
}

export const ProgressCardsAuditStatus = ({ failCount = 0, passCount = 0, totalCases = 0 }: AuditStatusProps) => {
  const remainingCount = Math.max(totalCases - (failCount + passCount), 0)

  const stats = [
    { status: "Failed", count: failCount, variant: "fail" },
    { status: "Passed", count: passCount, variant: "pass" },
    { status: "Remaining", count: remainingCount, variant: "remaining" }
  ] as const

  const statSummaries = stats.map(({ count, status }) => `${count} ${status.toLowerCase()}`)

  const srSummary = `${statSummaries.join(", ")} out of ${totalCases} total audits.`

  return (
    <section aria-label="Audit progress summary">
      <span className="govuk-visually-hidden">{srSummary}</span>

      <CardRow aria-hidden="true">
        {stats.map(({ status, count, variant }) => (
          <StatCard key={variant} $variant={variant}>
            <CardCount className="govuk-body-l">{count}</CardCount>
            <span className="govuk-body-m">{status}</span>
          </StatCard>
        ))}
      </CardRow>
    </section>
  )
}
