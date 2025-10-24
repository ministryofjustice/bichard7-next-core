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
    cy.contains(/Confirm your email address/i)
    cy.get("input[type=email]").type(emailAddress)
    cy.get("button[type=submit]").click()
    cy.contains(/We have sent a code to:/i)
  }

  function inputValidationCode(emailAddress) {
    cy.task("getVerificationCode", emailAddress).then((verificationCode) => {
      cy.get("input#validationCode").type(verificationCode)
      cy.get("button[type=submit]").click()
      cy.contains(/Create your new password/i)
    })
  }

  function resetPassword(emailAddress, newPassword) {
    newPassword && cy.get("input#newPassword").type(newPassword)
    newPassword && cy.get("input[type=password][name=confirmPassword]").type(newPassword)
    cy.get("button[type=submit]").click()
  }

  const emailAddress = "bichard01@example.com"

  it("should send out email to reset password", () => {
    requestPasswordReset(emailAddress)
  })

  it("should ignore email case when resetting the password", () => {
    requestPasswordReset(emailAddress.toUpperCase())
  })

  it("should prompt the user that password reset was successful when provided password is valid", () => {
    const newPassword = "Test@1234567"
    requestPasswordReset(emailAddress)
    inputValidationCode(emailAddress)
    resetPassword(emailAddress, newPassword)
    cy.contains(/Return to sign in page/i)
  })

  it("should not allow submission when passwords are too short", () => {
    requestPasswordReset(emailAddress)
    inputValidationCode(emailAddress)
    resetPassword(emailAddress, "shorty")
    cy.get('[data-test="error-summary"]').contains("Password must be 8 characters or more.")
  })

  it("should not allow submission when passwords contain sensitive information", () => {
    requestPasswordReset(emailAddress)
    inputValidationCode(emailAddress)
    resetPassword(emailAddress, "bichard01")
    cy.get('[data-test="error-summary"]').contains(
      "Password can't include identifiable information for example your name, last name or email address"
    )
  })

  it("should not allow submission when password is banned", () => {
    requestPasswordReset(emailAddress)
    inputValidationCode(emailAddress)
    resetPassword(emailAddress, "123456789")
    cy.get('[data-test="error-summary"]').contains("Password is too simple or easy to guess. Use a stronger password.")
  })

  it("should not allow submission when password is empty", () => {
    requestPasswordReset(emailAddress)
    inputValidationCode(emailAddress)
    resetPassword(emailAddress)
    cy.get('[data-test="error-summary"]').contains("Enter a new password")
  })

  it("should not allow submission when passwords do not match", () => {
    requestPasswordReset(emailAddress)
    inputValidationCode(emailAddress)
    cy.get("input#newPassword").type("Test@123456")
    cy.get("input[type=password][name=confirmPassword]").type("DifferentPassword")
    cy.get("button[type=submit]").click()
    cy.get('[data-test="error-summary"]').contains("Passwords do not match. Enter passwords again")
  })

  it("should not allow to reset using and old password", () => {
    cy.resetTablesToDefault()
    cy.task("insertIntoUsersTable")

    const newPassword = "Test@1234567"

    requestPasswordReset(emailAddress)
    inputValidationCode(emailAddress)
    resetPassword(emailAddress, newPassword)
    cy.contains(/Return to sign in page/i)

    requestPasswordReset(emailAddress)
    cy.contains(/We have sent a code to:/i)
    inputValidationCode(emailAddress)
    resetPassword(emailAddress, newPassword)
    cy.get('[data-test="error-summary"]').contains("Password used before. Enter a new password")
  })

  it("should respond with forbidden response code when CSRF tokens are invalid in reset password page", () => {
    cy.checkCsrf("/login/reset-password", "POST")
  })
})
