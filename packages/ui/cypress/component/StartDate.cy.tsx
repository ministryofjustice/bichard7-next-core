import { Offence } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { StartDate } from "../../src/features/CourtCaseDetails/Tabs/Panels/Offences/Offence/StartDate"

describe("Start Date", () => {
  it("renders date code 1 correctly", () => {
    const offence: Partial<Offence> = {
      ActualOffenceDateCode: "1",
      ActualOffenceStartDate: {
        StartDate: new Date("10/5/1955")
      }
    }

    cy.mount(<StartDate offence={offence as Offence} />)

    cy.contains("On or in")
    cy.contains("05/10/1955")
    cy.contains("Date code: 1")
  })

  it("renders date code 2 correctly", () => {
    const offence: Partial<Offence> = {
      ActualOffenceDateCode: "2",
      ActualOffenceStartDate: {
        StartDate: new Date("03/24/1984")
      }
    }

    cy.mount(<StartDate offence={offence as Offence} />)

    cy.contains("Before")
    cy.contains("24/03/1984")
    cy.contains("Date code: 2")
  })

  it("renders date code 3 correctly", () => {
    const offence: Partial<Offence> = {
      ActualOffenceDateCode: "3",
      ActualOffenceStartDate: {
        StartDate: new Date("07/04/1996")
      }
    }

    cy.mount(<StartDate offence={offence as Offence} />)

    cy.contains("After")
    cy.contains("04/07/1996")
    cy.contains("Date code: 3")
  })

  it("renders date code 4 correctly", () => {
    const offence: Partial<Offence> = {
      ActualOffenceDateCode: "4",
      ActualOffenceStartDate: {
        StartDate: new Date("08/29/1997")
      },
      ActualOffenceEndDate: {
        EndDate: new Date("07/25/2003")
      }
    }

    cy.mount(<StartDate offence={offence as Offence} />)

    cy.contains("Between")
    cy.contains("29/08/1997 and 25/07/2003")
    cy.contains("Date code: 4")
  })

  it("renders date code 5 correctly", () => {
    const offence: Partial<Offence> = {
      ActualOffenceDateCode: "5",
      ActualOffenceStartDate: {
        StartDate: new Date("02/14/2016")
      }
    }

    cy.mount(<StartDate offence={offence as Offence} />)

    cy.contains("On or about")
    cy.contains("14/02/2016")
    cy.contains("Date code: 5")
  })

  it("renders date code 6 correctly", () => {
    const offence: Partial<Offence> = {
      ActualOffenceDateCode: "6",
      ActualOffenceStartDate: {
        StartDate: new Date("12/24/1988")
      }
    }

    cy.mount(<StartDate offence={offence as Offence} />)

    cy.contains("On or before")
    cy.contains("24/12/1988")
    cy.contains("Date code: 6")
  })
})
