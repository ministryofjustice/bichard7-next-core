import type { Result } from "axe-core"

const logAccessibilityViolations = (violations: Result[]) => {
  console.log("Violations:", violations)

  const violationData = violations.map(({ id, impact, description, nodes }) => ({
    id,
    impact,
    description,
    nodes: nodes.length
  }))

  cy.task("table", violationData)
}

export default logAccessibilityViolations
