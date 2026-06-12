import React from "react"
import AutoSaveBase from "@/components/EditableFields/AutoSaveBase"

describe("AutoSaveBase Component", () => {
  let onSaveStub: sinon.SinonStub
  let setSavedStub: Cypress.Agent<sinon.SinonStub>
  let setChangedStub: Cypress.Agent<sinon.SinonStub>

  beforeEach(() => {
    onSaveStub = cy.stub().resolves()
    cy.wrap(onSaveStub).as("onSave")

    setSavedStub = cy.stub().as("setSaved")
    setChangedStub = cy.stub().as("setChanged")
  })

  it("renders children correctly", () => {
    cy.mount(
      <AutoSaveBase
        isSaved={false}
        isChanged={false}
        isValid={false}
        setSaved={setSavedStub}
        setChanged={setChangedStub}
        onSave={onSaveStub}
      >
        <div data-cy="child-element">{"Child Content"}</div>
      </AutoSaveBase>
    )

    cy.get('[data-cy="child-element"]').should("be.visible")
  })

  it("triggers onSave when input is valid, changed, and not saved", () => {
    cy.mount(
      <AutoSaveBase
        isSaved={false}
        isChanged={true}
        isValid={true}
        setSaved={setSavedStub}
        setChanged={setChangedStub}
        onSave={onSaveStub}
      />
    )

    cy.get("@onSave").should("have.been.calledOnce")
    cy.contains("Input saved").should("be.visible")
    cy.get("@setSaved").should("have.been.calledWith", true)
    cy.get("@setChanged").should("have.been.calledWith", false)
  })

  it("does not trigger onSave if the input is invalid", () => {
    cy.mount(
      <AutoSaveBase
        isSaved={false}
        isChanged={true}
        isValid={false}
        setSaved={setSavedStub}
        setChanged={setChangedStub}
        onSave={onSaveStub}
      />
    )

    cy.get("@onSave").should("not.have.been.called")
  })

  it("displays an error message when onSave throws an error", () => {
    const errorSaveStub = cy.stub().rejects(new Error("API Failed"))

    cy.wrap(errorSaveStub).as("onSaveError")

    cy.mount(
      <AutoSaveBase
        isSaved={false}
        isChanged={true}
        isValid={true}
        setSaved={setSavedStub}
        setChanged={setChangedStub}
        onSave={errorSaveStub}
      />
    )

    cy.get("@onSaveError").should("have.been.calledOnce")
    cy.contains("Autosave has failed, please refresh").should("be.visible")
  })
})
