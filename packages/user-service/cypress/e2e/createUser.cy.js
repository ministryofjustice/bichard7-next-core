describe("Creation of new user", () => {
  before(() => {
    cy.resetTablesToDefault()
    cy.task("insertIntoUsersTable")

    cy.task("insertIntoUserGroupsTable", {
      email: "bichard01@example.com",
      groups: ["B7UserManager_grp", "B7Supervisor_grp"]
    })
  })

  function populateNewUser(options) {
    const username = options.username || "NewUsername"
    const forenames = options.forenames || "NewForename"
    const surname = options.surname || "NewSurname"
    const emailAddress = options.emailAddress || "NewEmail@example.com"
    const orgServes = options.orgServes || "NewOrgServes"
    const visibleCourts = options.visibleCourts || "B01,B41ME00"

    cy.get('[data-test="text-input_username"]').type(username)
    cy.get('[data-test="text-input_forenames"]').type(forenames)
    cy.get('[data-test="text-input_surname"]').type(surname)
    cy.get('[data-test="text-input_emailAddress"]').type(emailAddress)
    cy.get('[data-test="text-input_orgServes"]').type(orgServes)
    visibleCourts && cy.get('[data-test="text-input_visibleCourts"]').type(visibleCourts)
  }

  it("should be successful and stay on add user page if all of the inputs are populated", () => {
    cy.login("bichard01@example.com", "password")
    cy.get("#user-management-link").click()
    cy.get("#add").click()

    cy.get('[data-test="B7ExceptionHandler_grp"]').should("have.text", "Exception Handler")
    cy.get('[data-test="B7GeneralHandler_grp"]').should("have.text", "General Handler")
    cy.get('[data-test="B7TriggerHandler_grp"]').should("have.text", "Trigger Handler")
    cy.get('[data-test="B7Supervisor_grp"]').should("have.text", "Supervisor")
    cy.get('[data-test="B7Allocator_grp"]').should("have.text", "Allocator")
    cy.get('[data-test="B7Audit_grp"]').should("have.text", "Audit")
    cy.get('[data-test="B7UserManager_grp"]').should("have.text", "User Manager")

    populateNewUser({
      username: "Buser",
      forenames: "B forename",
      surname: "B surname",
      emailAddress: "bichardemail1@example.com",
      orgServes: "B organisation"
    })

    cy.get("#visibleForces001").check({ force: true })
    cy.get("#visibleForces004").check({ force: true })
    cy.get('[data-test="included-triggers"]').click()
    cy.get("#excludedTriggersTRPR0001").uncheck({ force: true })

    cy.get("button[name=saveAndAddAnother]").click()
    cy.get('[data-test="success-banner_heading"]').should("have.text", "User Buser has been successfully created.")
  })

  it("should be successful and navigate to users page if all of the inputs are populated", () => {
    cy.login("bichard01@example.com", "password")
    cy.get("#user-management-link").click()
    cy.get("#add").click()

    populateNewUser({
      username: "Buser2",
      forenames: "B forename",
      surname: "B surname",
      emailAddress: "bichardemail2@example.com",
      orgServes: "B organisation"
    })

    cy.get("#visibleForces001").check({ force: true })
    cy.get("#visibleForces004").check({ force: true })

    cy.get('[data-test="included-triggers"]').click()
    cy.get("#excludedTriggersTRPR0001").uncheck({ force: true })

    cy.get("button[name=save]").click()
    cy.url().should("contain", "/users")
    cy.get("h3").should("have.text", "User created successfully.")
    cy.get("h1").should("have.text", "Users")
  })

  it("should show a newly-created user in the list of users", () => {
    cy.login("bichard01@example.com", "password")
    cy.get("#user-management-link").click()

    cy.get("#add").click()

    populateNewUser({
      username: "Buser3",
      forenames: "B forename",
      surname: "B surname",
      emailAddress: "buser3@example.com",
      orgServes: "B organisation"
    })

    cy.get("#visibleForces001").check({ force: true })
    cy.get("button[name=save]").click()

    cy.contains("Buser3")
    cy.contains("B forename")
    cy.contains("B surname")
    cy.contains("buser3@example.com")
  })

  it("doesn't update other users when a new user is created", () => {
    cy.login("bichard01@example.com", "password")
    cy.get("#user-management-link").click()

    cy.get("tbody tr:nth-child(1) td:nth-child(1)").should("have.text", "Bichard01")
    cy.get("tbody tr:nth-child(1) td:nth-child(2)").should("have.text", "Bichard User 01")
    cy.get("tbody tr:nth-child(1) td:nth-child(3)").should("have.text", "Surname 01")
    cy.get("tbody tr:nth-child(1) td:nth-child(4)").should("have.text", "bichard01@example.com")

    cy.get("tbody tr:nth-child(2) td:nth-child(1)").should("have.text", "Bichard02")
    cy.get("tbody tr:nth-child(2) td:nth-child(2)").should("have.text", "Bichard User 02")
    cy.get("tbody tr:nth-child(2) td:nth-child(3)").should("have.text", "Surname 02")
    cy.get("tbody tr:nth-child(2) td:nth-child(4)").should("have.text", "bichard02@example.com")

    cy.get("tbody tr:nth-child(3) td:nth-child(1)").should("have.text", "Bichard03")
    cy.get("tbody tr:nth-child(3) td:nth-child(2)").should("have.text", "Bichard User 03")
    cy.get("tbody tr:nth-child(3) td:nth-child(3)").should("have.text", "Surname 03")
    cy.get("tbody tr:nth-child(3) td:nth-child(4)").should("have.text", "bichard03@example.com")
  })

  it("should fail if previously used username is given", () => {
    cy.login("bichard01@example.com", "password")
    cy.get("#user-management-link").click()
    cy.get("#add").click()

    populateNewUser({
      username: "Bichard01",
      forenames: "B forename",
      surname: "B surname",
      emailAddress: "bemail2@example.com",
      orgServes: "B organisation"
    })

    cy.get("#visibleForces001").check({ force: true })

    cy.get("button[name=saveAndAddAnother]").click()
    cy.get('[data-test="error-summary"]').contains("Username Bichard01 already exists.")
  })

  it("should fail if no force is selected for user", () => {
    cy.login("bichard01@example.com", "password")
    cy.get("#user-management-link").click()
    cy.get("#add").click()

    populateNewUser({
      username: "Bichard01",
      forenames: "B forename",
      surname: "B surname",
      emailAddress: "bemail2@example.com",
      orgServes: "B organisation"
    })

    cy.get("button[name=saveAndAddAnother]").click()

    cy.get('[data-test="error-summary"]').contains("Please ensure that user is assigned to least one force.")
  })

  it("should show the correct values for groups select input when on the create new user page", () => {
    cy.task("selectFromGroupsTable").then((groups) => {
      const userGroups = groups.filter((g) => g.name === "B7Supervisor_grp" || g.name === "B7UserManager_grp")
      cy.login("bichard01@example.com", "password")
      cy.get("#user-management-link").click()
      cy.get("#add").click()
      cy.get('[data-test="checkbox-user-groups"]')
        .find('[data-test="checkbox-multiselect-checkboxes"]')
        .each(($el, index) => {
          cy.wrap($el).find(`#${userGroups[index].id}`).should("exist")
          cy.wrap($el).find("label").contains(userGroups[index].friendly_name)
        })
    })
  })

  it("should assign the correct group to a newly created user manager", () => {
    cy.login("bichard01@example.com", "password")
    cy.get("#user-management-link").click()
    cy.get("#add").click()

    populateNewUser({
      username: "Buserzz",
      forenames: "B forename zz",
      surname: "B surname zzz",
      emailAddress: "bemailzz@example.com",
      orgServes: "B organisation zz"
    })

    cy.get("#visibleForces001").check({ force: true })
    cy.get("#visibleForces004").check({ force: true })
    cy.get('[data-test="included-triggers"]').click()
    cy.get("#excludedTriggersTRPR0001").uncheck({ force: true })
    cy.get('[data-test="checkbox-user-groups"]')
      .find('[data-test="checkbox-multiselect-checkboxes"]')
      .find(`input[name="B7UserManager_grp"]`)
      .check({ force: true })
    cy.get("button[name=save]").click()

    cy.task("selectFromUsersGroupsTable").then((usersGroups) => {
      cy.task("selectFromGroupsTable").then((groups) => {
        const selectedGroup = groups.filter((g) => g.name === "B7UserManager_grp")[0]
        cy.task("selectFromUsersTable", "bemailzz@example.com").then((user) => {
          const userGroups = usersGroups.filter((u) => u.user_id === user.id)
          expect(user.id).to.equal(userGroups[0].user_id)
          expect(userGroups[0].group_id).to.equal(selectedGroup.id)
          expect(user.visible_forces).to.equal("001,004")
          expect(user.visible_courts).to.equal("B01,B41ME00")
          expect(user.excluded_triggers).to.equal("TRPR0001")
        })
      })
    })
  })

  it("should assign the correct group to a newly created general handler", () => {
    cy.login("bichard01@example.com", "password")
    cy.get("#user-management-link").click()
    cy.get("#add").click()

    populateNewUser({
      username: "Buserzz2",
      forenames: "B forename zz2",
      surname: "B surname zzz",
      emailAddress: "bemailzz2@example.com",
      orgServes: "B organisation zz"
    })

    cy.get("#visibleForces001").check({ force: true })
    cy.get("#visibleForces004").check({ force: true })
    cy.get('[data-test="included-triggers"]').click()
    cy.get("#excludedTriggersTRPR0001").uncheck({ force: true })
    cy.get('[data-test="checkbox-user-groups"]')
      .find('[data-test="checkbox-multiselect-checkboxes"]')
      .find(`input[name="B7GeneralHandler_grp"]`)
      .check({ force: true })
    cy.get("button[name=save]").click()

    cy.task("selectFromUsersGroupsTable").then((usersGroups) => {
      cy.task("selectFromGroupsTable").then((groups) => {
        const selectedGroup = groups.filter((g) => g.name === "B7GeneralHandler_grp")[0]
        cy.task("selectFromUsersTable", "bemailzz2@example.com").then((user) => {
          const userGroups = usersGroups.filter((u) => u.user_id === user.id)
          expect(user.id).to.equal(userGroups[0].user_id)
          expect(userGroups[0].group_id).to.equal(selectedGroup.id)
          expect(user.visible_forces).to.equal("001,004")
          expect(user.visible_courts).to.equal("B01,B41ME00")
          expect(user.excluded_triggers).to.equal("TRPR0001")
        })
      })
    })
  })

  it("should show a user-friendly validation error message when username contains a forbidden character", () => {
    cy.login("bichard01@example.com", "password")
    cy.get("#user-management-link").click()
    cy.get("#add").click()

    populateNewUser({
      username: "B%user2",
      forenames: "B forename",
      surname: "B surname",
      emailAddress: "bichardemail2@example.com",
      orgServes: "B organisation"
    })

    cy.get("#visibleForces001").check({ force: true })
    cy.get("#visibleForces004").check({ force: true })

    cy.get('[data-test="included-triggers"]').click()
    cy.get("#excludedTriggersTRPR0001").uncheck({ force: true })

    cy.get("button[name=save]").click()

    const errorMessage =
      "Your username may only contain letters, numbers, dots (.), hyphens(-) and/or underscores (_), your username must also begin and end with a letter or a number"

    // The summary should contain the validation error
    cy.get('[data-test="error-summary"]').should("be.visible").contains(errorMessage)

    // The validation error should be inline with the text input
    cy.get('[data-test="text-input_username-error"]').should("be.visible").contains(errorMessage)
  })

  it("should show a user-friendly validation error message when email contains the cjsm domain", () => {
    cy.login("bichard01@example.com", "password")
    cy.get("#user-management-link").click()
    cy.get("#add").click()

    populateNewUser({
      username: "Buser2",
      forenames: "B forename",
      surname: "B surname",
      emailAddress: "bichardemail2@example.cjsm.net",
      orgServes: "B organisation"
    })

    cy.get("#visibleForces001").check({ force: true })
    cy.get("#visibleForces004").check({ force: true })

    cy.get('[data-test="included-triggers"]').click()
    cy.get("#excludedTriggersTRPR0001").uncheck({ force: true })

    cy.get("button[name=save]").click()

    const errorMessage = "The user's email address should not end with .cjsm.net"

    // The summary should contain the validation error
    cy.get('[data-test="error-summary"]').should("be.visible").contains(errorMessage)

    // The validation error should be inline with the text input
    cy.get('[data-test="text-input_emailAddress-error"]').should("be.visible").contains(errorMessage)
  })

  it("should automatically have the endorsedBy field populated and be read only", () => {
    cy.login("bichard01@example.com", "password")
    cy.get("#user-management-link").click()
    cy.get("#add").click()

    cy.get('[data-test="text-input_endorsedBy"]')
      .should("contain.value", "Bichard01")
      .should("have.attr", "readonly", "readonly")
  })

  it("should respond with forbidden response code when CSRF tokens are invalid in new user page", () => {
    cy.checkCsrf("/users/new-user", "POST")
  })
})
