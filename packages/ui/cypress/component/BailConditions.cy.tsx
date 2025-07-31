import { Offence } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import { BailConditions } from "../../src/features/CourtCaseDetails/Tabs/Panels/BailConditions"

describe("BailConditions", () => {
  const reason = "expected reason"
  it("should not render the component if there are no bails", () => {
    cy.mount(<BailConditions bailConditions={[]} offences={[]} />)
    cy.contains("h2", "Bail conditions").should("not.exist")
    cy.get("dt").should("not.exist")
  })

  it("should render the list of bail conditions and", () => {
    const conditions = ["first condition", "second condition", "third condition"]
    cy.mount(<BailConditions bailConditions={conditions} bailReason={reason} offences={[]} />)
    cy.contains("h2", "Bail conditions").should("exist")
    cy.contains("dd", conditions[0]).should("exist")
    cy.contains("dd", conditions[1]).should("exist")
    cy.contains("dd", conditions[2]).should("exist")
    cy.contains("dt", "Bail reason").siblings().should("include.text", reason)
  })

  it("should generate labels of the bail conditions", () => {
    cy.mount(
      <BailConditions
        bailConditions={["Exclusion: first condition", "Curfew: second condition", "third condition"]}
        offences={[]}
        bailReason={reason}
      />
    )
    cy.contains("h2", "Bail conditions").should("exist")
    cy.contains("dt", "Exclusion").siblings().should("include.text", "Exclusion: first condition")
    cy.contains("dt", "Curfew").siblings().should("include.text", "Curfew: second condition")
    cy.contains("dt", "Other").siblings().should("include.text", "third condition")
    cy.contains("dt", "Bail reason").siblings().should("include.text", reason)
  })

  it("should include the offence number on the label where the bail condition is included in the offence result text", () => {
    cy.mount(
      <BailConditions
        bailConditions={["Exclusion: first condition", "Curfew: second condition", "third condition"]}
        offences={
          [
            {
              Result: [{ ResultVariableText: "First description of the offence Exclusion: first condition" }],
              CourtOffenceSequenceNumber: 1
            },
            {
              Result: [{ ResultVariableText: "Second description of the offence third condition; other conditions" }],
              CourtOffenceSequenceNumber: 2
            },
            {
              Result: [{ ResultVariableText: "Third description of the offence Curfew: second condition" }],
              CourtOffenceSequenceNumber: 3
            }
          ] as Offence[]
        }
        bailReason={reason}
      />
    )
    cy.contains("h2", "Bail conditions").should("exist")
    cy.contains("dt", "Offence 1").siblings().should("include.text", "Exclusion: first condition")
    cy.contains("dt", "Offence 3").siblings().should("include.text", "Curfew: second condition")
    cy.contains("dt", "Offence 2").siblings().should("include.text", "third condition")

    cy.contains("dt", "Bail reason").siblings().should("include.text", reason)
  })
})
