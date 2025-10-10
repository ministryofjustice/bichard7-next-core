import isValidUsername from "utils/isValidUsername"

describe("WHEN validating a users username", () => {
  describe("AND a valid username is entered", () => {
    it.each([["user.name"], ["user_name"], ["user-name"], ["username"]])(
      "GIVEN %p it SHOULD return true",
      (usernameToBeValidated) => {
        // When
        const result = isValidUsername(usernameToBeValidated)
        // Then
        expect(result).toBe(true)
      }
    )
  })
  describe("AND a non alphanumeric character is at the beginning of the proposed username", () => {
    it.each([
      [".username"],
      ["/username"],
      ["?username"],
      ["_username"],
      ["-username"],
      ["~username"],
      ["{username"],
      ["}username"],
      ["|username"],
      ["\\username"],
      ["[username"],
      ["]username"]
    ])("GIVEN %p it SHOULD return false", (usernameToBeValidated) => {
      // When
      const result = isValidUsername(usernameToBeValidated)
      // Then
      expect(result).toBe(false)
    })
  })
  describe("AND a space is at the beginning of the proposed username", () => {
    it("SHOULD return false", () => {
      // Given
      const proposedUsername = " username"
      // When
      const result = isValidUsername(proposedUsername)
      // Then
      expect(result).toBe(false)
    })
  })

  describe("AND a space is included in the proposed username", () => {
    it("SHOULD return false", () => {
      // Given
      const proposedUsername = " user name"
      // When
      const result = isValidUsername(proposedUsername)
      // Then
      expect(result).toBe(false)
    })
  })

  describe("AND a space is at the end of the proposed username", () => {
    it("SHOULD return false", () => {
      // Given
      const proposedUsername = "user name "
      // When
      const result = isValidUsername(proposedUsername)
      // Then
      expect(result).toBe(false)
    })
  })

  describe("AND a non-alphaneumeric that is not . - _ is somewhere in the username", () => {
    it.each([
      ["u/sername"],
      ["us?ername"],
      ["use~rname"],
      ["user{name"],
      ["usern}ame"],
      ["userna|me"],
      ["usernam\\e"],
      ["u[sername"],
      ["us]ername"]
    ])("GIVEN %p it SHOULD return false", (usernameToBeValidated) => {
      // When
      const result = isValidUsername(usernameToBeValidated)
      // Then
      expect(result).toBe(false)
    })
  })
  describe("AND a non alphanumeric character is at the end of the proposed username", () => {
    it.each([
      ["username."],
      ["username/"],
      ["username?"],
      ["username_"],
      ["username-"],
      ["username~"],
      ["username{"],
      ["username}"],
      ["username|"],
      ["username\\"],
      ["username["],
      ["username]"]
    ])("GIVEN %p it SHOULD return false", (usernameToBeValidated) => {
      // When
      const result = isValidUsername(usernameToBeValidated)
      // Then
      expect(result).toBe(false)
    })
  })
})
