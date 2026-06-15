import React from "react"
import Permission from "@moj-bichard7/common/types/Permission"
import { FORCES_WITH_ALLOCATION_ENABLED } from "@/config"
import { DisplayFullUser } from "@/types/display/Users"
import { DisplayPartialCourtCase } from "@/types/display/CourtCases"
import {
  ColumnType,
  generateAllocationComponent
} from "@/features/CourtCaseList/CourtCaseListEntry/CourtCaseListEntryCells/generateAllocationComponent"

const AllocationWrapper = ({
  user,
  columnType,
  courtCase
}: {
  user: DisplayFullUser
  columnType: ColumnType
  courtCase: DisplayPartialCourtCase
}) => {
  const component = generateAllocationComponent(user, columnType, courtCase)

  return <div data-cy="allocation-container">{component ?? <span data-cy="null-output">{"Null"}</span>}</div>
}

describe("generateAllocationComponent", () => {
  const mockCourtCase = { errorId: 999 } as DisplayPartialCourtCase

  const createMockUser = (canAllocate: boolean, forces: string[]): DisplayFullUser => {
    return {
      hasAccessTo: {
        [Permission.CanAllocate]: canAllocate
      },
      visibleForces: forces
    } as unknown as DisplayFullUser
  }

  beforeEach(() => {
    cy.stub(FORCES_WITH_ALLOCATION_ENABLED, "has").callsFake((force) => force === "ALLOCATION_FORCE")
  })

  it("returns null if the user does not have CanAllocate permission", () => {
    const user = createMockUser(false, ["ALLOCATION_FORCE"])

    cy.mount(<AllocationWrapper user={user} columnType="exceptions" courtCase={mockCourtCase} />)

    cy.get('[data-cy="null-output"]').should("be.visible")
    cy.contains("Allocate exceptions").should("not.exist")
  })

  it("returns null if the user has no visible forces with allocation enabled", () => {
    const user = createMockUser(true, ["NON_ALLOCATION_FORCE"])

    cy.mount(<AllocationWrapper user={user} columnType="exceptions" courtCase={mockCourtCase} />)

    cy.get('[data-cy="null-output"]').should("be.visible")
    cy.contains("Allocate exceptions").should("not.exist")
  })

  it("renders the AllocateUser component when both conditions are met", () => {
    const user = createMockUser(true, ["ALLOCATION_FORCE"])

    cy.mount(<AllocationWrapper user={user} columnType="exceptions" courtCase={mockCourtCase} />)

    cy.get('[data-cy="null-output"]').should("not.exist")
    cy.contains("button", "Allocate exceptions").should("be.visible")
  })

  it("passes the correct columnType props to the AllocateUser component", () => {
    const user = createMockUser(true, ["ALLOCATION_FORCE"])

    cy.mount(<AllocationWrapper user={user} columnType="triggers" courtCase={mockCourtCase} />)

    cy.get('[data-cy="null-output"]').should("not.exist")
    cy.contains("button", "Allocate triggers").should("be.visible")
  })
})
