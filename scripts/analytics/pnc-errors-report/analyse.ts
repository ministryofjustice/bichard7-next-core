function main() {
  const fs = require("fs")

  const { pncErrors } = JSON.parse(
    fs.readFileSync("scripts/analytics/pnc-errors-report/pnc-response-received-audit-logs-events.json")
  )

  const phase1PncErrors = new Set(
    pncErrors.filter((pncError) => pncError.phase === 1).map((pncError) => pncError.pncErrorMessage.substring(0, 5))
  )

  const phase3PncErrors = new Set(
    pncErrors.filter((pncError) => pncError.phase === 3).map((pncError) => pncError.pncErrorMessage.substring(0, 5))
  )

  console.log({ phase1PncErrors, phase3PncErrors })
}

main()
