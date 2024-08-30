import AutoSave from "components/EditableFields/AutoSave"
import { CourtCaseContext } from "context/CourtCaseContext"
import React, { useState } from "react"
import { AmendmentKeys } from "types/Amendments"
import { DisplayFullCourtCase } from "types/display/CourtCases"
import HO100200 from "../fixtures/HO100200.json"

describe("AutoSave", () => {
  const courtCase = HO100200 as unknown as DisplayFullCourtCase
  courtCase.errorId = 0

  interface HelperInterfaceProps {
    isValid: boolean
    hasBeenSaved: boolean
    hasChanged: boolean
    amendmentFields: AmendmentKeys[]
    children?: React.ReactNode
  }
  const Helper = ({ isValid, hasBeenSaved, hasChanged, amendmentFields, children }: HelperInterfaceProps) => {
    const [isSaved, setIsSaved] = useState<boolean>(hasBeenSaved)
    const [isChanged, setIsChanged] = useState<boolean>(hasChanged)

    return (
      <div>
        <AutoSave
          setSaved={setIsSaved}
          setChanged={setIsChanged}
          isValid={isValid}
          isSaved={isSaved}
          isChanged={isChanged}
          amendmentFields={amendmentFields}
        >
          {children}
        </AutoSave>
      </div>
    )
  }

  describe(`doesn't call the "update" endpoint when`, () => {
    beforeEach(() => {
      cy.intercept("/bichard/api/court-cases/0/update", cy.spy().as("update"))
    })

    afterEach(() => {
      cy.get("@update").should("not.have.been.called")
      cy.get(".error-message").should("not.exist")
      cy.get(".success-message").should("not.exist")
    })

    it("doesn't display children", () => {
      cy.mount(
        <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
          <Helper isValid={false} hasBeenSaved={true} hasChanged={false} amendmentFields={[]} />
        </CourtCaseContext.Provider>
      )
    })

    it("displays children", () => {
      cy.mount(
        <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
          <Helper isValid={false} hasBeenSaved={true} hasChanged={false} amendmentFields={[]}>
            {"This is a message"}
          </Helper>
        </CourtCaseContext.Provider>
      )
    })

    it("doesn't have any amendments to save", () => {
      cy.mount(
        <CourtCaseContext.Provider value={[{ courtCase, amendments: {}, savedAmendments: {} }, () => {}]}>
          <Helper isValid={false} hasBeenSaved={true} hasChanged={false} amendmentFields={[]} />
        </CourtCaseContext.Provider>
      )
    })

    it("displays no message when it has been saved and has changed", () => {
      cy.mount(
        <CourtCaseContext.Provider value={[{ courtCase, amendments: { asn: "1234" }, savedAmendments: {} }, () => {}]}>
          <Helper isValid={false} hasBeenSaved={true} hasChanged={true} amendmentFields={["asn"]} />
        </CourtCaseContext.Provider>
      )
    })

    it("displays no message when it hasn't been saved and has not been changed", () => {
      cy.mount(
        <CourtCaseContext.Provider value={[{ courtCase, amendments: { asn: "1234" }, savedAmendments: {} }, () => {}]}>
          <Helper isValid={false} hasBeenSaved={false} hasChanged={false} amendmentFields={["asn"]} />
        </CourtCaseContext.Provider>
      )
    })

    it("displays no message when it has the same amendments and savedAmendments", () => {
      cy.mount(
        <CourtCaseContext.Provider
          value={[{ courtCase, amendments: { asn: "1234" }, savedAmendments: { asn: "1234" } }, () => {}]}
        >
          <Helper isValid={false} hasBeenSaved={false} hasChanged={true} amendmentFields={["asn"]} />
        </CourtCaseContext.Provider>
      )
    })

    it("displays no message when the value is invalid", () => {
      cy.mount(
        <CourtCaseContext.Provider value={[{ courtCase, amendments: { asn: "1234" }, savedAmendments: {} }, () => {}]}>
          <Helper isValid={false} hasBeenSaved={false} hasChanged={true} amendmentFields={["asn"]} />
        </CourtCaseContext.Provider>
      )
    })
  })

  it("displays a success message when it hasn't been saved and has changed", () => {
    cy.intercept("PUT", "/bichard/api/court-cases/0/update", {
      statusCode: 200
    })

    cy.mount(
      <CourtCaseContext.Provider value={[{ courtCase, amendments: { asn: "1234" }, savedAmendments: {} }, () => {}]}>
        <Helper isValid={true} hasBeenSaved={false} hasChanged={true} amendmentFields={["asn"]} />
      </CourtCaseContext.Provider>
    )

    cy.get(".success-message")
      .invoke("text")
      .then((text) => {
        expect(text).equals("Input saved")
      })
  })

  it("displays a success message when it has the new amendments and old savedAmendments", () => {
    cy.intercept("PUT", "/bichard/api/court-cases/0/update", {
      statusCode: 200
    })

    cy.mount(
      <CourtCaseContext.Provider
        value={[{ courtCase, amendments: { asn: "5678" }, savedAmendments: { asn: "1234" } }, () => {}]}
      >
        <Helper isValid={true} hasBeenSaved={false} hasChanged={true} amendmentFields={["asn"]} />
      </CourtCaseContext.Provider>
    )

    cy.get(".success-message")
      .invoke("text")
      .then((text) => {
        expect(text).equals("Input saved")
      })
  })

  it("displays an error message (404)", () => {
    cy.intercept("PUT", "/bichard/api/court-cases/0/update", {
      statusCode: 404
    })

    cy.mount(
      <CourtCaseContext.Provider value={[{ courtCase, amendments: { asn: "1234" }, savedAmendments: {} }, () => {}]}>
        <Helper isValid={true} hasBeenSaved={false} hasChanged={true} amendmentFields={["asn"]} />
      </CourtCaseContext.Provider>
    )

    cy.get(".error-message")
      .invoke("text")
      .then((text) => {
        expect(text).equals("Autosave has failed, please refresh")
      })
  })

  it("displays an error message (500)", () => {
    cy.intercept("PUT", "/bichard/api/court-cases/0/update", {
      statusCode: 500
    })

    cy.mount(
      <CourtCaseContext.Provider value={[{ courtCase, amendments: { asn: "1234" }, savedAmendments: {} }, () => {}]}>
        <Helper isValid={true} hasBeenSaved={false} hasChanged={true} amendmentFields={["asn"]} />
      </CourtCaseContext.Provider>
    )

    cy.get(".error-message")
      .invoke("text")
      .then((text) => {
        expect(text).equals("Autosave has failed, please refresh")
      })
  })
})
