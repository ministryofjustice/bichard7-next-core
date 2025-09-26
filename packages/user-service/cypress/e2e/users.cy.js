describe("Display a list of few users", () => {
  beforeEach(() => {
    cy.resetTablesToDefault()
    cy.task("insertIntoUsersTable")
  })

  it("should display a list of user in tabular form", () => {
    cy.task("insertIntoUserGroupsTable", {
      email: "bichard01@example.com",
      groups: ["B7UserManager_grp"]
    })
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

  it("should display the correct list of users when using the filter", () => {
    cy.task("insertIntoUserGroupsTable", {
      email: "bichard01@example.com",
      groups: ["B7UserManager_grp"]
    })
    cy.task("insertIntoUserGroupsTable", {
      email: "bichard02@example.com",
      groups: ["B7UserManager_grp"]
    })
    cy.login("bichard01@example.com", "password")
    cy.get("body").contains(
      /If you have any queries about your permissions or you cannot see the resources you expect, please contact one of the user managers for your force./i
    )
    cy.get("details").click()
    cy.get('[data-test="manager-list"]').contains("Bichard User 01 Surname 01")
    cy.get('[data-test="manager-list"]').contains("Bichard User 02 Surname 02")
    cy.visit("/users")
    cy.get('input[id="filter"]').type("Bichard02")
    cy.get('button[id="filter"]').click()
    cy.get("tbody tr:nth-child(1) td:nth-child(1)").should("have.text", "Bichard02")
    cy.get("tbody tr:nth-child(1) td:nth-child(2)").should("have.text", "Bichard User 02")
    cy.get("tbody tr:nth-child(1) td:nth-child(3)").should("have.text", "Surname 02")
    cy.get("tbody tr:nth-child(1) td:nth-child(4)").should("have.text", "bichard02@example.com")

    cy.get('input[id="filter"]').focus()
    cy.get('input[id="filter"]').clear()
    cy.get('input[id="filter"]').type("bichard03")
    cy.get('button[id="filter"]').click()
    cy.get("tbody tr:nth-child(1) td:nth-child(1)").should("have.text", "Bichard03")
    cy.get("tbody tr:nth-child(1) td:nth-child(2)").should("have.text", "Bichard User 03")
    cy.get("tbody tr:nth-child(1) td:nth-child(3)").should("have.text", "Surname 03")
    cy.get("tbody tr:nth-child(1) td:nth-child(4)").should("have.text", "bichard03@example.com")
  })

  it("should display the correct list of users when using the filter when logged in as super user", () => {
    cy.task("insertIntoUserGroupsTable", {
      email: "bichard04@example.com",
      groups: ["B7UserManager_grp", "B7SuperUserManager_grp"]
    })
    cy.login("bichard04@example.com", "password")
    cy.get("#user-management-link").click()
    cy.get('input[id="filter"]').type("Bichard02")
    cy.get('button[id="filter"]').click()
    cy.get("tbody tr:nth-child(1) td:nth-child(1)").should("have.text", "Bichard02")
    cy.get("tbody tr:nth-child(1) td:nth-child(2)").should("have.text", "Bichard User 02")
    cy.get("tbody tr:nth-child(1) td:nth-child(3)").should("have.text", "Surname 02")
    cy.get("tbody tr:nth-child(1) td:nth-child(4)").should("have.text", "bichard02@example.com")

    cy.get('input[id="filter"]').focus()
    cy.get('input[id="filter"]').clear()
    cy.get('input[id="filter"]').type("bichard03")
    cy.get('button[id="filter"]').click()
    cy.get("tbody tr:nth-child(1) td:nth-child(1)").should("have.text", "Bichard03")
    cy.get("tbody tr:nth-child(1) td:nth-child(2)").should("have.text", "Bichard User 03")
    cy.get("tbody tr:nth-child(1) td:nth-child(3)").should("have.text", "Surname 03")
    cy.get("tbody tr:nth-child(1) td:nth-child(4)").should("have.text", "bichard03@example.com")
  })
})

describe("Display a list of many users", () => {
  beforeEach(() => {
    cy.resetTablesToDefault()
    cy.task("insertManyIntoUsersTable")
  })

  it("should display in paginated view when returning many users", () => {
    cy.task("insertIntoUserGroupsTable", {
      email: "bichard01@example.com",
      groups: ["B7UserManager_grp"]
    })
    cy.login("bichard01@example.com", "password")
    cy.get("#user-management-link").click()
    cy.get("tbody tr:nth-child(1) td:nth-child(1)").should("have.text", "Bichard01")
    cy.get("tbody tr:nth-child(2) td:nth-child(1)").should("have.text", "Bichard02")
    cy.get("tbody tr:nth-child(3) td:nth-child(1)").should("have.text", "Bichard03")
    cy.get("tbody tr:nth-child(4) td:nth-child(1)").should("have.text", "Bichard04")
    cy.get("tbody tr:nth-child(5) td:nth-child(1)").should("have.text", "Bichard05")
    cy.get("tbody tr:nth-child(6) td:nth-child(1)").should("have.text", "Bichard06")
    cy.get("tbody tr:nth-child(7) td:nth-child(1)").should("have.text", "Bichard07")
    cy.get("tbody tr:nth-child(8) td:nth-child(1)").should("have.text", "Bichard08")
    cy.get("tbody tr:nth-child(9) td:nth-child(1)").should("have.text", "Bichard09")
    cy.get("tbody tr:nth-child(10) td:nth-child(1)").should("have.text", "Bichard10")

    cy.get('a[data-test="Next"]').click()
    cy.get("tbody tr:nth-child(1) td:nth-child(1)").should("have.text", "Bichard11")
    cy.get("tbody tr:nth-child(2) td:nth-child(1)").should("have.text", "Bichard12")
    cy.get("tbody tr:nth-child(3) td:nth-child(1)").should("have.text", "Bichard13")

    cy.get('a[data-test="Prev"]').click()
    cy.get("tbody tr:nth-child(1) td:nth-child(1)").should("have.text", "Bichard01")
    cy.get("tbody tr:nth-child(2) td:nth-child(1)").should("have.text", "Bichard02")
    cy.get("tbody tr:nth-child(3) td:nth-child(1)").should("have.text", "Bichard03")
    cy.get("tbody tr:nth-child(4) td:nth-child(1)").should("have.text", "Bichard04")
    cy.get("tbody tr:nth-child(5) td:nth-child(1)").should("have.text", "Bichard05")
    cy.get("tbody tr:nth-child(6) td:nth-child(1)").should("have.text", "Bichard06")
    cy.get("tbody tr:nth-child(7) td:nth-child(1)").should("have.text", "Bichard07")
    cy.get("tbody tr:nth-child(8) td:nth-child(1)").should("have.text", "Bichard08")
    cy.get("tbody tr:nth-child(9) td:nth-child(1)").should("have.text", "Bichard09")
    cy.get("tbody tr:nth-child(10) td:nth-child(1)").should("have.text", "Bichard10")
  })

  it("should display different users depending on the force codes assigned", () => {
    cy.task("insertIntoUserGroupsTable", {
      email: "bichard13@example.com",
      groups: ["B7UserManager_grp"]
    })
    cy.login("bichard13@example.com", "password")
    cy.get("#user-management-link").click()
    cy.get("tbody tr:nth-child(1) td:nth-child(1)").should("have.text", "Bichard01")
    cy.get("tbody tr:nth-child(2) td:nth-child(1)").should("have.text", "Bichard02")
    cy.get("tbody tr:nth-child(3) td:nth-child(1)").should("have.text", "Bichard03")
    cy.get("tbody tr:nth-child(4) td:nth-child(1)").should("have.text", "Bichard04")
    cy.get("tbody tr:nth-child(5) td:nth-child(1)").should("have.text", "Bichard05")
    cy.get("tbody tr:nth-child(6) td:nth-child(1)").should("have.text", "Bichard06")
    cy.get("tbody tr:nth-child(7) td:nth-child(1)").should("have.text", "Bichard09")
    cy.get("tbody tr:nth-child(8) td:nth-child(1)").should("have.text", "Bichard10")
    cy.get("tbody tr:nth-child(9) td:nth-child(1)").should("have.text", "Bichard11")
    cy.get("tbody tr:nth-child(10) td:nth-child(1)").should("have.text", "Bichard12")

    cy.get('input[id="filter"]').type("Bichard1")
    cy.get('button[id="filter"]').click()
    cy.get("tbody tr:nth-child(1) td:nth-child(1)").should("have.text", "Bichard10")
    cy.get("tbody tr:nth-child(2) td:nth-child(1)").should("have.text", "Bichard11")
    cy.get("tbody tr:nth-child(3) td:nth-child(1)").should("have.text", "Bichard12")
    cy.get("tbody tr:nth-child(4) td:nth-child(1)").should("have.text", "Bichard13")
  })
})

describe("Display page navigation buttons correctly", () => {
  it("should display next button when the number of users are one more than the max users displayed per page", () => {
    cy.resetTablesToDefault()
    cy.task("insertManyIntoUsersTable", 11)

    cy.task("insertIntoUserGroupsTable", {
      email: "bichard01@example.com",
      groups: ["B7UserManager_grp"]
    })
    cy.login("bichard01@example.com", "password")
    cy.get("#user-management-link").click()
    cy.get("tbody tr:nth-child(1) td:nth-child(1)").should("have.text", "Bichard01")
    cy.get("tbody tr:nth-child(2) td:nth-child(1)").should("have.text", "Bichard02")
    cy.get("tbody tr:nth-child(3) td:nth-child(1)").should("have.text", "Bichard03")
    cy.get("tbody tr:nth-child(4) td:nth-child(1)").should("have.text", "Bichard04")
    cy.get("tbody tr:nth-child(5) td:nth-child(1)").should("have.text", "Bichard05")
    cy.get("tbody tr:nth-child(6) td:nth-child(1)").should("have.text", "Bichard06")
    cy.get("tbody tr:nth-child(7) td:nth-child(1)").should("have.text", "Bichard07")
    cy.get("tbody tr:nth-child(8) td:nth-child(1)").should("have.text", "Bichard08")
    cy.get("tbody tr:nth-child(9) td:nth-child(1)").should("have.text", "Bichard09")
    cy.get("tbody tr:nth-child(10) td:nth-child(1)").should("have.text", "Bichard10")

    cy.get('a[data-test="Next"]').click()
    cy.get("tbody tr:nth-child(1) td:nth-child(1)").should("have.text", "Bichard11")

    cy.get('a[data-test="Prev"]').click()
    cy.get("tbody tr:nth-child(1) td:nth-child(1)").should("have.text", "Bichard01")
    cy.get("tbody tr:nth-child(2) td:nth-child(1)").should("have.text", "Bichard02")
    cy.get("tbody tr:nth-child(3) td:nth-child(1)").should("have.text", "Bichard03")
    cy.get("tbody tr:nth-child(4) td:nth-child(1)").should("have.text", "Bichard04")
    cy.get("tbody tr:nth-child(5) td:nth-child(1)").should("have.text", "Bichard05")
    cy.get("tbody tr:nth-child(6) td:nth-child(1)").should("have.text", "Bichard06")
    cy.get("tbody tr:nth-child(7) td:nth-child(1)").should("have.text", "Bichard07")
    cy.get("tbody tr:nth-child(8) td:nth-child(1)").should("have.text", "Bichard08")
    cy.get("tbody tr:nth-child(9) td:nth-child(1)").should("have.text", "Bichard09")
    cy.get("tbody tr:nth-child(10) td:nth-child(1)").should("have.text", "Bichard10")
  })
})
