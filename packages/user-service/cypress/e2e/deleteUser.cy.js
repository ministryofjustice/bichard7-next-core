describe("Delete user", () => {
  beforeEach(() => {
    cy.resetTablesToDefault()
    cy.task("insertIntoUsersTable")

    cy.task("insertIntoUserGroupsTable", {
      email: "bichard01@example.com",
      groups: ["B7UserManager_grp", "B7Supervisor_grp"]
    })
  })

  it("should delete the user when confirmation text is valid", () => {
    cy.login("bichard01@example.com", "password")
    cy.get("#user-management-link").click()

    cy.get('a[href="users/Bichard02"]').click()
    cy.get('a[data-test="delete-user-view"]').click()
    cy.get("h1").contains("Are you sure you want to delete Bichard User 02 Surname 02?")
    cy.get("input[id=delete-account-confirmation]").type("Bichard02")
    cy.get("button[type=submit]").click()
    cy.url().should("contains", "/users")
    cy.get("h3").should("have.text", "User deleted successfully.")
  })

  it("should prevent the user from deleting themselves", () => {
    cy.login("bichard01@example.com", "password")
    cy.get("#user-management-link").click()

    cy.get('a[href="users/Bichard01"]').click()
    cy.get('[data-test="disabled-delete-anchor"]').should("have.attr", "class", "disabled-link")
  })

  it("should prevent the user from deleting themselves by visiting the delete url", () => {
    cy.login("bichard01@example.com", "password")
    cy.visit("/users/Bichard01/delete")

    cy.get('[data-test="text-input_deleteAccountConfirmation"]').type("Bichard01")
    cy.get('[data-test="delete_delete-account-btn"]').click()

    cy.get('[data-test="error-summary"]').contains("There is a problem")
    cy.get('[data-test="error-summary"]').contains(
      "A user may not delete themselves, please contact another user manager to delete your user"
    )
  })

  it("should not allow deleting the user when confirmation text is invalid", () => {
    cy.login("bichard01@example.com", "password")
    cy.visit("/users/Bichard02")
    cy.get('a[data-test="delete-user-view"]').click()
    cy.get("h1").contains("Are you sure you want to delete Bichard User 02 Surname 02?")
    cy.get("input[id=delete-account-confirmation]").type("Invalid input")
    cy.get("button[type=submit]").click()
    cy.get('[data-test="error-summary"]').contains("Username mismatch")
    cy.get('[data-test="error-summary"]').contains("Enter the account username")
    cy.url().should("contains", "/users/Bichard02/delete")
  })

  it("should not allow deleting the user when confirmation text is empty", () => {
    cy.login("bichard01@example.com", "password")
    cy.visit("/users/Bichard02")
    cy.get('a[data-test="delete-user-view"]').click()
    cy.get("h1").contains("Are you sure you want to delete Bichard User 02 Surname 02?")
    cy.get("button[type=submit]").click()
    cy.get('[data-test="error-summary"]').contains("Username mismatch")
    cy.get('[data-test="error-summary"]').contains("Enter the account username")
    cy.url().should("contains", "/users/Bichard02/delete")
  })

  it("should not allow the current user to navigate to /delete when user is in a different force", () => {
    cy.login("bichard02@example.com", "password")

    cy.visit("/users/Bichard03/delete", { failOnStatusCode: false })

    cy.get('[data-test="404_header"]').should("contain.text", "Page not found")
  })

  it("should respond with forbidden response code when CSRF tokens are invalid in delete page", () => {
    cy.checkCsrf("/users/Bichard01/delete", "POST")
  })

  it("should be able to delete user regardless of force if current user is super user", () => {
    cy.task("insertIntoUserGroupsTable", {
      email: "bichard04@example.com",
      groups: ["B7UserManager_grp", "B7SuperUserManager_grp"]
    })
    cy.login("bichard04@example.com", "password")
    cy.visit("/users/Bichard03")
    cy.get('a[data-test="delete-user-view"]').click()
    cy.get("h1").contains("Are you sure you want to delete Bichard User 03 Surname 03?")
    cy.get("input[id=delete-account-confirmation]").type("Bichard03")
    cy.get("button[type=submit]").click()
    cy.url().should("contains", "/users")
    cy.get("h3").should("have.text", "User deleted successfully.")
  })
})
