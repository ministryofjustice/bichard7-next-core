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
    amendmentFields: AmendmentKeys[]
    children?: React.ReactNode
    hasBeenSaved: boolean
    hasChanged: boolean
    isValid: boolean
  }
  const Helper = ({ amendmentFields, children, hasBeenSaved, hasChanged, isValid }: HelperInterfaceProps) => {
    const [isSaved, setIsSaved] = useState<boolean>(hasBeenSaved)
    const [isChanged, setIsChanged] = useState<boolean>(hasChanged)

    return (
      <div>
        <AutoSave
          amendmentFields={amendmentFields}
          isChanged={isChanged}
          isSaved={isSaved}
          isValid={isValid}
          setChanged={setIsChanged}
          setSaved={setIsSaved}
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
        <CourtCaseContext.Provider value={[{ amendments: {}, courtCase, savedAmendments: {} }, () => {}]}>
          <Helper amendmentFields={[]} hasBeenSaved={true} hasChanged={false} isValid={false} />
        </CourtCaseContext.Provider>
      )
    })

    it("displays children", () => {
      cy.mount(
        <CourtCaseContext.Provider value={[{ amendments: {}, courtCase, savedAmendments: {} }, () => {}]}>
          <Helper amendmentFields={[]} hasBeenSaved={true} hasChanged={false} isValid={false}>
            {"This is a message"}
          </Helper>
        </CourtCaseContext.Provider>
      )
    })

    it("doesn't have any amendments to save", () => {
      cy.mount(
        <CourtCaseContext.Provider value={[{ amendments: {}, courtCase, savedAmendments: {} }, () => {}]}>
          <Helper amendmentFields={[]} hasBeenSaved={true} hasChanged={false} isValid={false} />
        </CourtCaseContext.Provider>
      )
    })

    it("displays no message when it has been saved and has changed", () => {
      cy.mount(
        <CourtCaseContext.Provider value={[{ amendments: { asn: "1234" }, courtCase, savedAmendments: {} }, () => {}]}>
          <Helper amendmentFields={["asn"]} hasBeenSaved={true} hasChanged={true} isValid={false} />
        </CourtCaseContext.Provider>
      )
    })

    it("displays no message when it hasn't been saved and has not been changed", () => {
      cy.mount(
        <CourtCaseContext.Provider value={[{ amendments: { asn: "1234" }, courtCase, savedAmendments: {} }, () => {}]}>
          <Helper amendmentFields={["asn"]} hasBeenSaved={false} hasChanged={false} isValid={false} />
        </CourtCaseContext.Provider>
      )
    })

    it("displays no message when it has the same amendments and savedAmendments", () => {
      cy.mount(
        <CourtCaseContext.Provider
          value={[{ amendments: { asn: "1234" }, courtCase, savedAmendments: { asn: "1234" } }, () => {}]}
        >
          <Helper amendmentFields={["asn"]} hasBeenSaved={false} hasChanged={true} isValid={false} />
        </CourtCaseContext.Provider>
      )
    })

    it("displays no message when the value is invalid", () => {
      cy.mount(
        <CourtCaseContext.Provider value={[{ amendments: { asn: "1234" }, courtCase, savedAmendments: {} }, () => {}]}>
          <Helper amendmentFields={["asn"]} hasBeenSaved={false} hasChanged={true} isValid={false} />
        </CourtCaseContext.Provider>
      )
    })
  })

  it("displays a success message when it hasn't been saved and has changed", () => {
    cy.intercept("PUT", "/bichard/api/court-cases/0/update", {
      statusCode: 200
    })

    cy.mount(
      <CourtCaseContext.Provider value={[{ amendments: { asn: "1234" }, courtCase, savedAmendments: {} }, () => {}]}>
        <Helper amendmentFields={["asn"]} hasBeenSaved={false} hasChanged={true} isValid={true} />
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
        value={[{ amendments: { asn: "5678" }, courtCase, savedAmendments: { asn: "1234" } }, () => {}]}
      >
        <Helper amendmentFields={["asn"]} hasBeenSaved={false} hasChanged={true} isValid={true} />
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
      <CourtCaseContext.Provider value={[{ amendments: { asn: "1234" }, courtCase, savedAmendments: {} }, () => {}]}>
        <Helper amendmentFields={["asn"]} hasBeenSaved={false} hasChanged={true} isValid={true} />
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
      <CourtCaseContext.Provider value={[{ amendments: { asn: "1234" }, courtCase, savedAmendments: {} }, () => {}]}>
        <Helper amendmentFields={["asn"]} hasBeenSaved={false} hasChanged={true} isValid={true} />
      </CourtCaseContext.Provider>
    )

    cy.get(".error-message")
      .invoke("text")
      .then((text) => {
        expect(text).equals("Autosave has failed, please refresh")
      })
  })
})
