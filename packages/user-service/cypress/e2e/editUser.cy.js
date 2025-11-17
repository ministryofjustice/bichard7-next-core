import users from "../../testFixtures/database/data/users"

const [, bichard02] = users
const currentUserGroupNames = ["B7UserManager_grp", "B7ExceptionHandler_grp"]
const getCurrentUserGroups = (allGroups) => allGroups.filter((g) => currentUserGroupNames.includes(g.name))

describe("Edit user", () => {
  beforeEach(() => {
    cy.resetTablesToDefault()
    cy.task("insertIntoUsersTable")

    cy.task("insertIntoUserGroupsTable", {
      email: "bichard02@example.com",
      groups: currentUserGroupNames
    })
  })

  it("should display correct user details when navigating to the edit user page", () => {
    cy.login("bichard02@example.com", "password")

    const emailAddress = "bichard02@example.com"
    cy.visit("users/Bichard02")
    cy.get('a[data-test="edit-user-view"]').click()

    // this should be in a component test
    cy.get('[data-test="B7ExceptionHandler_grp"]').should("have.text", "Exception Handler")
    cy.get('[data-test="B7GeneralHandler_grp"]').should("have.text", "General Handler")
    cy.get('[data-test="B7TriggerHandler_grp"]').should("have.text", "Trigger Handler")
    cy.get('[data-test="B7Supervisor_grp"]').should("have.text", "Supervisor")
    cy.get('[data-test="B7Allocator_grp"]').should("have.text", "Allocator")
    cy.get('[data-test="B7Audit_grp"]').should("have.text", "Audit")
    cy.get('[data-test="B7UserManager_grp"]').should("have.text", "User Manager")

    cy.get('[data-test="text-input_username"]').should("have.value", bichard02.username)
    cy.get('[data-test="text-input_forenames"]').should("have.value", bichard02.forenames)
    cy.get('[data-test="text-input_orgServes"]').should("have.value", bichard02.org_serves)
    cy.get('[data-test="text-input_visibleCourts"]').should("have.value", bichard02.visible_courts)

    cy.get('input[id="visibleForces001"]').should("be.checked")
    cy.get('input[id="visibleForces002"]').should("be.checked")
    cy.get('input[id="visibleForces004"]').should("be.checked")

    cy.get('[data-test="included-triggers"]').click()
    cy.get('input[id="excludedTriggersTRPR0001"]').should("be.checked")
    cy.get('input[id="excludedTriggersTRPR0002"]').should("be.checked")
    cy.get('input[id="excludedTriggersTRPR0003"]').should("be.checked")
    cy.get('input[id="excludedTriggersTRPR0004"]').should("not.be.checked")
    cy.get('input[id="excludedTriggersTRPR0005"]').should("be.checked")

    cy.task("selectGroupsForUser", emailAddress).then((groups) => {
      const selectedGroups = getCurrentUserGroups(groups).map((group) => {
        return `[name="${group.name}"]`
      })

      cy.get('div[data-test="checkbox-user-groups"]').find(`input${selectedGroups}`).should("be.checked")
      cy.get('div[data-test="checkbox-user-groups"]').find(`input:not(${selectedGroups})`).should("not.be.checked")
    })
  })

  it("should not allow a user to view another user outside of their force", () => {
    cy.login("bichard02@example.com", "password")

    cy.visit("/users/Bichard03", { failOnStatusCode: false })

    cy.get("body").should("not.contain.text", "User Details")
    cy.get("body").should("not.contain.text", "Bichard03")
    cy.get("body").should("not.contain.text", "Bichard User 03")
    cy.get("body").should("not.contain.text", "Surname 03")
    cy.get("body").should("not.contain.text", "bichard03@example.com")
    cy.get("body").should("contain.text", "Page not found")
  })

  it("should not allow a user to edit another user outside of their force", () => {
    cy.login("bichard02@example.com", "password")

    cy.visit("/users/Bichard03/edit", { failOnStatusCode: false })

    cy.get("body").should("not.contain.text", "Edit Bichard03's details")
    cy.get("body").should("not.contain.text", "Bichard03")
    cy.get("body").should("not.contain.text", "bichard03@example.com")
    cy.get('input[id="username"]').should("not.exist")
    cy.get("body").should("contain.text", "Page not found")
  })

  it("should not be able to update user such that they are left without a force", () => {
    cy.login("bichard02@example.com", "password")
    cy.visit("users/Bichard01")
    cy.get('a[data-test="edit-user-view"]').click()
    cy.get('input[id="visibleForces001"]').uncheck({ force: true })
    cy.get('input[id="visibleForces002"]').uncheck({ force: true })
    cy.get('input[id="visibleForces004"]').uncheck({ force: true })

    cy.get('button[type="submit"]').click()

    cy.get('[data-test="error-summary"]').contains("Please ensure that user is assigned to least one force.")
  })

  it("should update user correctly when updating user details", () => {
    cy.login("bichard02@example.com", "password")
    cy.visit("users/Bichard01")
    cy.get('a[data-test="edit-user-view"]').click()

    cy.get('[data-test="text-input_forenames"]').clear()
    cy.get('[data-test="text-input_forenames"]').type("forename change 01")
    cy.get('[data-test="text-input_orgServes"]').clear()
    cy.get('[data-test="text-input_orgServes"]').type("org change 02")
    cy.get('input[id="visibleForces001"]').uncheck({ force: true })
    cy.get('input[id="visibleForces002"]').check()
    cy.get('[data-test="text-input_visibleCourts"]').clear()
    cy.get('[data-test="text-input_visibleCourts"]').type("B02,B42MD00")
    cy.get('[data-test="included-triggers"]').click()

    cy.get('input[id="excludedTriggersTRPR0001"]').uncheck({ force: true })
    cy.get('input[id="excludedTriggersTRPR0004"]').uncheck({ force: true })
    cy.get('[data-test="checkbox-user-groups"]')
      .find('[data-test="checkbox-multiselect-checkboxes"]')
      .find(`input[name="B7ExceptionHandler_grp"]`)
      .check({ force: true })
    cy.get('[data-test="checkbox-user-groups"]')
      .find('[data-test="checkbox-multiselect-checkboxes"]')
      .find(`input[name="B7GeneralHandler_grp"]`)
      .check({ force: true })
    cy.get('button[type="submit"]').click()

    cy.get('[data-test="error-summary"]').should("not.exist")
    cy.get('[data-test="text-input_username"]').should("have.value", "Bichard01")
    cy.get('[data-test="text-input_forenames"]').should("have.value", "forename change 01")
    cy.get('[data-test="text-input_emailAddress"]').should("have.value", "bichard01@example.com")
    cy.get('[data-test="text-input_orgServes"]').should("have.value", "org change 02")
    cy.get('[data-test="included-triggers"]').click()
    cy.get('input[id="excludedTriggersTRPR0001"]').should("not.be.checked")
    cy.get('input[id="excludedTriggersTRPR0004"]').should("not.be.checked")
    cy.get('[data-test="checkbox-user-groups"]').find(`input[name="B7ExceptionHandler_grp"]`).should("be.checked")
    cy.get('[data-test="checkbox-user-groups"]').find(`input[name="B7GeneralHandler_grp"]`).should("be.checked")
  })

  it("should invalidate form correctly when form in not valid", () => {
    cy.login("bichard02@example.com", "password")
    cy.visit("users/Bichard01")
    cy.get('a[data-test="edit-user-view"]').click()
    cy.get('[data-test="text-input_forenames"]').clear()
    cy.get('[data-test="text-input_surname"]').clear()
    cy.get('button[type="submit"]').click()
    cy.get('[data-test="error-summary"').should("be.visible")
    cy.get('[data-test="error-summary"]').contains("Enter the user's forename(s)")
    cy.get('[data-test="error-summary"]').contains("Enter the user's surname")
  })

  it("should respond with forbidden response code when CSRF tokens are invalid in edit page", () => {
    cy.checkCsrf("/users/Bichard01/edit", "POST")
  })

  it("should have the email and username text input fields readonly", () => {
    cy.login("bichard02@example.com", "password")
    cy.visit("users/Bichard02/edit")
    cy.get('input[value="Bichard02"]').invoke("attr", "readonly").should("eq", "readonly")
  })

  it("should show the correct values for groups select input when on the edit user page", () => {
    cy.login("bichard02@example.com", "password")
    cy.task("selectFromGroupsTable").then(() => {
      cy.visit("users/Bichard01/edit")
      cy.get('[data-test="checkbox-user-groups"]')
      cy.get('[data-test="checkbox-user-groups"]')
        .find('[data-test="checkbox-multiselect-checkboxes"]')
        .find("label")
        .should("have.length", 7)

      cy.get('[data-test="B7ExceptionHandler_grp"]').should("have.text", "Exception Handler")
      cy.get('[data-test="B7GeneralHandler_grp"]').should("have.text", "General Handler")
      cy.get('[data-test="B7TriggerHandler_grp"]').should("have.text", "Trigger Handler")
      cy.get('[data-test="B7Supervisor_grp"]').should("have.text", "Supervisor")
      cy.get('[data-test="B7Allocator_grp"]').should("have.text", "Allocator")
      cy.get('[data-test="B7Audit_grp"]').should("have.text", "Audit")
      cy.get('[data-test="B7UserManager_grp"]').should("have.text", "User Manager")
    })
  })

  it("should remove 'endorsed by' field when in edit", () => {
    cy.visit("users/new-user")

    cy.get('[data-test="text-input_endorsedBy"]').should("not.exist")
  })

  it("should de able to edit any user when logged in as super user", () => {
    cy.task("insertIntoUserGroupsTable", {
      email: "bichard04@example.com",
      groups: ["B7UserManager_grp", "B7SuperUserManager_grp"]
    })
    cy.login("bichard04@example.com", "password")
    cy.visit("/users")
    cy.visit("users/Bichard01")
    cy.get('a[data-test="edit-user-view"]').click()
    cy.get('[data-test="text-input_forenames"]').clear()
    cy.get('[data-test="text-input_forenames"]').type("forename change 01")
    cy.get('[data-test="text-input_orgServes"]').clear()
    cy.get('[data-test="text-input_orgServes"]').type("org change 02")
    cy.get('input[id="visibleForces001"]').uncheck({ force: true })
    cy.get('input[id="visibleForces002"]').check()
    cy.get('[data-test="text-input_visibleCourts"]').clear()
    cy.get('[data-test="text-input_visibleCourts"]').type("B02,B42MD00")
    cy.get('[data-test="included-triggers"]').click()
    cy.get('input[id="excludedTriggersTRPR0001"]').uncheck({ force: true })
    cy.get('input[id="excludedTriggersTRPR0004"]').uncheck({ force: true })

    cy.get('button[type="submit"]').click()

    cy.get('[data-test="error-summary"]').should("not.exist")
    cy.get('[data-test="text-input_username"]').should("have.value", "Bichard01")
    cy.get('[data-test="text-input_forenames"]').should("have.value", "forename change 01")
    cy.get('[data-test="text-input_emailAddress"]').should("have.value", "bichard01@example.com")
    cy.get('[data-test="text-input_orgServes"]').should("have.value", "org change 02")
    cy.get('[data-test="included-triggers"]').click()
    cy.get('input[id="excludedTriggersTRPR0001"]').should("not.be.checked")
    cy.get('input[id="excludedTriggersTRPR0004"]').should("not.be.checked")
  })
})
