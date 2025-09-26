const emailCookieName = "LOGIN_EMAIL"
const authCookieName = ".AUTH"
const user = {
  password: "password",
  email: "bichard01@example.com"
}

describe("Logging In", () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.resetTablesToDefault()
    cy.task("insertIntoUsersTable")
  })

  it("should initially only ask for an email", () => {
    cy.visit("/login")
    cy.get("input[type=email]").should("be.visible")
    cy.get("button[type=submit").should("be.visible")
    cy.get("input[type=password]").should("not.exist")
  })

  it("should prompt the user to check their emails after entering an email address", () => {
    cy.visit("/login")
    cy.get("input[type=email]").type(user.email)
    cy.get("button[type=submit]").click()
    cy.get("body").contains(/sent you an email/i)
  })

  it("should prompt the user to check their emails even if the entered email address does not belong to a user", () => {
    cy.visit("/login")
    cy.get("input[type=email]").type("userdoesnotexist@example.com")
    cy.get("button[type=submit]").click()
    cy.get("body").contains(/sent you an email/i)
  })

  it("should not allow submission of something that isn't an email address", () => {
    cy.visit("/login")
    cy.get("input[type=email]").type("foobar")
    cy.get("button[type=submit]").click()
    cy.url().should("match", /\/login\/?$/)
  })

  it("should display an error if an password is incorrect and verification code is correct", () => {
    cy.visit("/login")
    cy.get("input[type=email]").type(user.email)
    cy.get("button[type=submit]").click()
    cy.task("getVerificationCode", user.email).then((verificationCode) => {
      cy.get("input#validationCode").type(verificationCode)
      cy.get("input#password").type("wrongPassword")
      cy.get("button[type=submit]").click()
      cy.get('[data-test="error-summary"]').should("be.visible").contains("h2", "Your details do not match")
    })
  })

  it("should display an error if password is correct but verification code is incorrect", () => {
    cy.visit("/login")
    cy.get("input[type=email]").type(user.email)
    cy.get("button[type=submit]").click()
    cy.get("input#validationCode").type("123456")
    cy.get("input#password").type(user.password)
    cy.get("button[type=submit]").click()
    cy.get('[data-test="error-summary"]').should("be.visible").contains("h2", "Your details do not match")
  })

  it("should redirect to Bichard with a token in the cookie when password and verification code are correct", () => {
    cy.visit("/login")
    cy.get("input[type=email]").type(user.email)
    cy.get("button[type=submit]").click()
    cy.get("input#validationCode").should("exist")
    cy.task("getVerificationCode", user.email).then((verificationCode) => {
      cy.get("input#validationCode").type(verificationCode)
      cy.get("input#password").type(user.password)
      cy.get("button[type=submit]").click()
      cy.url().should("match", /\/users/)
      cy.get("body").should("contain", "Welcome Bichard User 01")
      cy.getCookie(authCookieName).should("exist")
    })

    it("should allow login with case-insensitive email address", () => {
      cy.visit("/login")
      cy.get("input[type=email]").type(user.email.toUpperCase())
      cy.get("button[type=submit]").click()
      cy.get("input#validationCode").should("exist")
      cy.task("getVerificationCode", user.email).then((verificationCode) => {
        cy.get("input#validationCode").type(verificationCode)
        cy.get("input#password").type(user.password)
        cy.get("button[type=submit]").click()
        cy.url().should("match", /\/users/)
        cy.get("body").should("contain", "Welcome Bichard User 01")
        cy.getCookie(authCookieName).should("exist")
      })
    })

    it("should accept a correct password and verification code even after incorrect password attempt", () => {
      cy.visit("/login")
      cy.get("input[type=email]").type(user.email)
      cy.get("button[type=submit]").click()
      cy.get("input#validationCode").should("exist")
      cy.task("getVerificationCode", user.email).then((verificationCode) => {
        cy.get("input#validationCode").type(verificationCode)
        cy.get("input#password").type("wrongPassword")
        cy.get("button[type=submit]").click()
        cy.get('[data-test="error-summary"]').should("be.visible").contains("h2", "Your details do not match")

        // Note: Although we avoid waits in cypress test as the logic implemented is temporal in nature we can consider this OK
        // Need to wait 10 seconds after inputting an incorrect password
        /* eslint-disable-next-line cypress/no-unnecessary-waiting */
        cy.wait(10000)
        cy.get("input[type=password][name=password]").type(user.password)
        cy.get("button[type=submit]").click()

        cy.get("body").should("contain", "Welcome Bichard User 01")
        cy.url().should("match", /\/users/)
      })
    })

    it("should remember email address when remember checkbox is checked", () => {
      cy.visit("/login")
      cy.get("input[type=email]").type(user.email)
      cy.get("button[type=submit]").click()
      cy.get("input#validationCode").should("exist")
      cy.task("getVerificationCode", user.email).then((verificationCode) => {
        cy.get("input#validationCode").type(verificationCode)
        cy.get("input#password").type(user.password)
        cy.get("input[id=rememberEmailYes]").should("not.be.checked")
        cy.get("input[id=rememberEmailYes]").click()
        cy.get("button[type=submit]").click()
        cy.url().should("match", /\/users/)

        cy.clearCookie(authCookieName)
        cy.visit("/login")
        cy.get("body").should("contain", user.email)
        cy.get("input#validationCode").should("not.exist")
        cy.get("input#password").type(user.password)
        cy.get("input[id=rememberEmailYes]").should("be.checked")
        cy.get("button[type=submit]").trigger("click")
        cy.url().should("match", /\/users/)

        const expectedRememberEmailCookieExpiry = new Date()
        expectedRememberEmailCookieExpiry.setHours(expectedRememberEmailCookieExpiry.getHours() + 24)
        cy.getCookie(emailCookieName)
          .should("exist")
          .then((cookie) => {
            const { expiry, httpOnly } = cookie
            const actualExpiry = new Date(expiry * 1000)

            expect(httpOnly).to.equal(true)
            expect(actualExpiry.toDateString()).to.equal(expectedRememberEmailCookieExpiry.toDateString())
            expect(actualExpiry.getHours()).to.equal(expectedRememberEmailCookieExpiry.getHours())
            expect(actualExpiry.getMinutes()).to.equal(expectedRememberEmailCookieExpiry.getMinutes())
          })
      })
    })

    it("should remove the cookie when remember checkbox is unchecked", () => {
      cy.visit("/login")
      cy.get("input[type=email]").type(user.email)
      cy.get("button[type=submit]").click()
      cy.get("input#validationCode").should("exist")
      cy.task("getVerificationCode", user.email).then((verificationCode) => {
        cy.get("input#validationCode").type(verificationCode)
        cy.get("input#password").type(user.password)
        cy.get("input[id=rememberEmailYes]").click()
        cy.get("button[type=submit]").click()
        cy.url().should("match", /\/users/)

        cy.get("a[data-test=logout").click()
        cy.get("a[data-test=log-back-in").click()
        cy.get("body").should("contain", user.email)
        cy.get("input#validationCode").should("not.exist")
        cy.get("input#password").type(user.password)
        cy.get("input[id=rememberEmailYes]").click()
        cy.get("button[type=submit]").trigger("click")
        cy.url().should("match", /\/users/)

        const expectedRememberEmailCookieExpiry = new Date()
        expectedRememberEmailCookieExpiry.setHours(expectedRememberEmailCookieExpiry.getHours() + 24)
        cy.get("button[type=submit]").click()
        cy.get("a[data-test=logout]").click()
        cy.get("a[data-test=log-back-in]").click()
        cy.getCookie(emailCookieName).should("have.property", "value", "")
      })
    })

    it("should forget remembered email address when 'not you' link is clicked", () => {
      cy.visit("/login")
      cy.get("input[type=email]").type(user.email)
      cy.get("button[type=submit]").click()
      cy.get("input#validationCode").should("exist")
      cy.task("getVerificationCode", user.email).then((verificationCode) => {
        cy.get("input#validationCode").type(verificationCode)
        cy.get("input#password").type(user.password)
        cy.get("input[id=rememberEmailYes]").click()
        cy.get("button[type=submit]").click()
        cy.url().should("match", /\/users/)

        cy.get("a[data-test=logout]").click()
        cy.get("a[data-test=log-back-in]").click()
        cy.get("body").should("contain", user.email)
        cy.get("a[data-test=not-you-link]").click()
        cy.url().should("match", /\/login\?notYou=true$/)
        cy.get("body").should("not.contain", user.email)
        cy.getCookie(emailCookieName).should("have.property", "value", "")
      })
    })

    it("should respond with forbidden response code when CSRF tokens are invalid in login page", () => {
      cy.checkCsrf("/login", "POST")
    })

    it("should update the token id in the database on every login", () => {
      const emailAddress = user.email
      const password = "password"

      cy.login(emailAddress, password)

      let firstJwtId
      cy.task("selectFromUsersTable", emailAddress).then((u) => {
        firstJwtId = u.jwt_id
      })

      // Note: Although we avoid waits in cypress test as the logic implemented is temporal in nature we can consider this OK
      // Need to wait 10 seconds after inputting a correct password
      /* eslint-disable-next-line cypress/no-unnecessary-waiting */
      cy.wait(10000)

      cy.clearCookies()
      cy.login(emailAddress, password)
      cy.task("selectFromUsersTable", emailAddress).then((u) => {
        expect(u.jwt_id).not.to.equal(firstJwtId)
      })
    })

    it("doesn't show the login page to a logged-in user", () => {
      cy.login(user.email, "password")

      cy.visit("/login")
      cy.url().should("not.match", /\/login\//)
      cy.get("input[type=email]").should("not.exist")
    })

    it("allows a user to login with their CJSM email address", () => {
      const cjsmEmailAddress = `${user.email}.cjsm.net`

      cy.visit("/login")
      cy.get("input[type=email]").type(cjsmEmailAddress)
      cy.get("button[type=submit]").click()
      cy.get("input#validationCode").should("exist")
      cy.task("getVerificationCode", user.email).then((verificationCode) => {
        cy.get("input#validationCode").type(verificationCode)
        cy.get("input#password").type(user.password)
        cy.get("button[type=submit]").click()
        cy.url().should("match", /\/users/)
      })
    })

    it("doesn't allow user to login after incorrectly inserting password 3 times", () => {
      cy.visit("/login")
      cy.get("input[type=email]").type(user.email)
      cy.get("button[type=submit]").click()
      cy.get("input#validationCode").should("exist")

      cy.task("getVerificationCode", user.email).then((verificationCode) => {
        // first incorrect login attempt
        cy.get("input#validationCode").type(verificationCode)
        cy.get("input#password").type("wrongPassword")
        cy.get("button[type=submit]").click()
        cy.get('[data-test="error-summary"]').should("be.visible").contains("h2", "Your details do not match")

        // Note: Although we avoid waits in cypress test as the logic implemented is temporal in nature we can consider this OK
        // Need to wait 10 seconds after inputting an incorrect password
        /* eslint-disable-next-line cypress/no-unnecessary-waiting */
        cy.wait(10000)

        // second incorrect login attempt
        cy.get("input#password").type("wrongPassword")
        cy.get("button[type=submit]").click()
        cy.get('[data-test="error-summary"]').should("be.visible").contains("h2", "Your details do not match")

        // Note: Although we avoid waits in cypress test as the logic implemented is temporal in nature we can consider this OK
        // Need to wait 10 seconds after inputting an incorrect password
        /* eslint-disable-next-line cypress/no-unnecessary-waiting */
        cy.wait(10000)

        // third incorrect login attempt
        cy.get("input#password").type("wrongPassword")
        cy.get("button[type=submit]").click()
        cy.get('[data-test="error-summary"]').should("be.visible").contains("Too many incorrect password attempts")
      })
    })
  })
})
