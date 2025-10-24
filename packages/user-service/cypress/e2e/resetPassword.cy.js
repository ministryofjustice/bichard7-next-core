describe("Reset password", () => {
  before(() => {
    cy.resetTablesToDefault()
    cy.task("insertIntoUsersTable")
    cy.task("insertIntoUserGroupsTable", {
      email: "bichard01@example.com",
      groups: ["B7UserManager_grp", "B7Supervisor_grp"]
    })
  })

  function requestPasswordReset(emailAddress) {
    cy.visit("/login")
    cy.get('[data-test="helpSigningIn"]').click()
    cy.get("a[data-test='reset-password']").click()
    cy.contains(/reset password/i)
    cy.get("input[type=email]").type(emailAddress)
    cy.get("button[type=submit]").click()
    cy.contains(/sent you an email/i)
  }

  function resetPassword(emailAddress, newPassword) {
    cy.task("getVerificationCode", emailAddress).then((verificationCode) => {
      cy.get("input#validationCode").type(verificationCode)
      newPassword && cy.get("input#newPassword").type(newPassword)
      newPassword && cy.get("input[type=password][name=confirmPassword]").type(newPassword)
      cy.get("button[type=submit]").click()
    })
  }

  it("should send out email to reset password", () => {
    requestPasswordReset("bichard01@example.com")
  })

  it("should ignore email case when resetting the password", () => {
    requestPasswordReset("bichard01@example.com".toUpperCase())
  })

  it("should allow user to generate a random password", () => {
    requestPasswordReset("bichard01@example.com")
    cy.get("div[data-test='generated-password']").should("not.exist")
    cy.get("a[data-test='generate-password']").click()
    cy.get("div[data-test='generated-password']").should("not.be.empty")
  })

  it("should prompt the user that password reset was successful when provided password is valid", () => {
    const newPassword = "Test@1234567"
    requestPasswordReset("bichard01@example.com")
    resetPassword("bichard01@example.com", newPassword)
    cy.contains(/You can now sign in with your new password./i)
  })

  it("should not allow submission when passwords are too short", () => {
    requestPasswordReset("bichard01@example.com")
    resetPassword("bichard01@example.com", "shorty")
    cy.get('[data-test="error-summary"]').contains("Password is too short.")
  })

  it("should not allow submission when passwords contain sensitive information", () => {
    requestPasswordReset("bichard01@example.com")
    resetPassword("bichard01@example.com", "bichard01")
    cy.get('[data-test="error-summary"]').contains("Password contains personal information.")
  })

  it("should not allow submission when password is banned", () => {
    requestPasswordReset("bichard01@example.com")
    resetPassword("bichard01@example.com", "123456789")
    cy.get('[data-test="error-summary"]').contains("Password is too easy to guess.")
  })

  it("should not allow submission when password is empty", () => {
    requestPasswordReset("bichard01@example.com")
    resetPassword("bichard01@example.com")
    cy.get('[data-test="error-summary"]').contains("Enter a new password")
  })

  it("should not allow submission when passwords do not match", () => {
    requestPasswordReset("bichard01@example.com")
    cy.task("getVerificationCode", "bichard01@example.com").then((verificationCode) => {
      cy.get("input#validationCode").type(verificationCode)
      cy.get("input#newPassword").type("Test@123456")
      cy.get("input[type=password][name=confirmPassword]").type("DifferentPassword")
      cy.get("button[type=submit]").click()
      cy.get('[data-test="error-summary"]').contains("Enter the same password twice")
    })
  })

  it("should not allow to reset using and old password", () => {
    cy.resetTablesToDefault()
    cy.task("insertIntoUsersTable")

    const newPassword = "Test@1234567"

    requestPasswordReset("bichard01@example.com")
    resetPassword("bichard01@example.com", newPassword)
    cy.contains(/You can now sign in with your new password./i)

    requestPasswordReset("bichard01@example.com")
    cy.contains(/sent you an email/i)
    resetPassword("bichard01@example.com", newPassword)
    cy.get('[data-test="error-summary"]').contains("Cannot use previously used password.")
  })

  it("should respond with forbidden response code when CSRF tokens are invalid in reset password page", () => {
    cy.checkCsrf("/login/reset-password", "POST")
  })
})
