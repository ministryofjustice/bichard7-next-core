import { Offence } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { BailConditions } from "../../src/features/CourtCaseDetails/Tabs/Panels/BailConditions"

describe("BailConditions", () => {
  const reason = "expected reason"
  it("should not render the component if there are no bails", () => {
    cy.mount(<BailConditions bailConditions={[]} offences={[]} />)
    cy.contains("H3", "Bail conditions").should("not.exist")
    cy.get("td").should("not.exist")
  })

  it("should render the list of bail conditions and", () => {
    const conditions = ["first condition", "second condition", "third condition"]
    cy.mount(<BailConditions bailConditions={conditions} bailReason={reason} offences={[]} />)
    cy.contains("H3", "Bail conditions").should("exist")
    cy.contains("td", conditions[0]).should("exist")
    cy.contains("td", conditions[1]).should("exist")
    cy.contains("td", conditions[2]).should("exist")
    cy.contains("td", "Bail reason").siblings().should("include.text", reason)
  })

  it("should generate labels of the bail conditions", () => {
    cy.mount(
      <BailConditions
        bailConditions={["Exclusion: first condition", "Curfew: second condition", "third condition"]}
        offences={[]}
        bailReason={reason}
      />
    )
    cy.contains("H3", "Bail conditions").should("exist")
    cy.contains("td", "Exclusion").siblings().should("include.text", "Exclusion: first condition")
    cy.contains("td", "Curfew").siblings().should("include.text", "Curfew: second condition")
    cy.contains("td", "Other").siblings().should("include.text", "third condition")
    cy.contains("td", "Bail reason").siblings().should("include.text", reason)
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
    cy.contains("H3", "Bail conditions").should("exist")
    cy.contains("td", "Offence 1").siblings().should("include.text", "Exclusion: first condition")
    cy.contains("td", "Offence 3").siblings().should("include.text", "Curfew: second condition")
    cy.contains("td", "Offence 2").siblings().should("include.text", "third condition")

    cy.contains("td", "Bail reason").siblings().should("include.text", reason)
  })
})
