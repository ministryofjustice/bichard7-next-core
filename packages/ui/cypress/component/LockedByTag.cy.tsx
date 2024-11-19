import LockedByButton from "../../src/features/CourtCaseList/tags/LockedByTag/LockedByButton"
import LockedByText from "../../src/features/CourtCaseList/tags/LockedByTag/LockedByText"

describe("LockedByText.cy.tx", () => {
  it("shows the icon and the text", () => {
    cy.mount(<LockedByText lockedBy={"Bichard02"} />)
    cy.contains("Bichard02")
  })
})

describe("LockedByButton.cy.tx", () => {
  it("shows the icon and the text", () => {
    cy.mount(
      <LockedByButton lockedBy={"Bichard02"} setShowUnlockConfirmation={() => {}} showUnlockConfirmation={false} />
    )
    cy.contains("Bichard02")
  })
})
