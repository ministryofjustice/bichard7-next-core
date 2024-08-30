import users from "../fixtures/users"

const runningWithProxy = (): boolean => {
  if (Cypress.config("baseUrl") === "https://localhost:4443") {
    console.log(`Running with proxy: ${Cypress.config("baseUrl")}`)
    return true
  }
  console.log(`Running locally: ${Cypress.config("baseUrl")}`)
  return false
}

const login = ({ emailAddress, password }: { emailAddress: string; password: string }) => {
  cy.visit(!runningWithProxy() ? "https://localhost:4443/users" : "/users")
  cy.get("input[type=email]").type(emailAddress)
  cy.get("button[type=submit]").click()
  cy.get("input#validationCode").should("exist")
  cy.task("getVerificationCode", emailAddress).then((verificationCode) => {
    cy.get("input#validationCode").type(verificationCode as string)
    cy.get("input#password").type(password)
    cy.get("button[type=submit]").click()
  })
}

Cypress.Commands.add("loginAs", (type: string) => {
  const user = users[type]

  if (!user) {
    throw new Error(`Could not find user: ${type}`)
  }

  cy.task("insertUsers", {
    users: [user],
    userGroups: user.groups
  })
  cy.login(user.email!, "password")
})

Cypress.Commands.add("login", (emailAddress, password) => {
  cy.session(
    emailAddress,
    () => {
      cy.intercept("GET", "http://bichard7.service.justice.gov.uk/forces.js?forceID=***", {})

      login({ emailAddress, password })
    },
    {
      validate() {
        cy.visit("/bichard")
        cy.get("a.moj-header__navigation-link").eq(1).should("have.text", "Sign out")
      }
    }
  )
})

Cypress.Commands.add("checkCsrf", (url) => {
  cy.request({
    failOnStatusCode: false,
    method: "POST",
    url,
    headers: {
      cookie: "CSRFToken%2Flogin=JMHZOOog-n0ZMO-UfRCZTCUxiQutsEeLpS8I.CJOHfajQ2zDKOZPaBh5J8VT%2FK4UrG6rB6o33VIvK04g"
    },
    form: true,
    followRedirect: false,
    body: {
      CSRFToken:
        "CSRFToken%2Flogin=1629375460103.JMHZOOog-n0ZMO-UfRCZTCUxiQutsEeLpS8I.7+42/hdHVuddtxLw8IvGvIPVhkFj6kbvYukS1mGm64o"
    }
  }).then((withTokensResponse) => {
    expect(withTokensResponse.status.toString()).not.to.match(/2\d{2}/, `${url} response code is 2xx`)
    cy.request({
      failOnStatusCode: false,
      method: "POST",
      url,
      form: true,
      followRedirect: false
    }).then((withoutTokensResponse) => {
      expect(withoutTokensResponse.status.toString()).not.to.match(/2\d{2}/, `${url} response code is 2xx`)
    })
  })
})

Cypress.Commands.add("toBeUnauthorized", (url: string) => {
  if (runningWithProxy()) {
    cy.visit(url, { failOnStatusCode: false })
    cy.url().should("match", /\/users/)
  } else {
    cy.request({
      failOnStatusCode: false,
      url: url
    }).then((response) => {
      expect(response.status).to.eq(401)
    })
  }
})

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      findByText(text: string): Chainable<Element>
      login(emailAddress: string, password: string): Chainable<Element>
      loginAs(type: string): Chainable<Element>
      checkCsrf(url: string): Chainable<Element>
      toBeUnauthorized(url: string): Chainable<Element>
    }
  }
}

export {}
