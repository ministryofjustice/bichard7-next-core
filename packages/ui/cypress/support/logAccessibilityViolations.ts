// eslint-disable-next-line import/no-extraneous-dependencies
import type { Result } from "axe-core"

const logAccessibilityViolations = (violations: Result[]) => {
  console.log(violations)
  const violationData = violations.map(({ description, id, impact, nodes }) => ({
    description,
    id,
    impact,
    nodes: nodes.length
  }))

  cy.task("table", violationData)
}

export default logAccessibilityViolations
