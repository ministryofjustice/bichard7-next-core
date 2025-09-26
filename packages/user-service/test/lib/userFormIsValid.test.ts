import userFormIsValid from "lib/userFormIsValid"
import User from "types/User"

describe("userFormIsValid", () => {
  it("should return false when username is empty", () => {
    const userDetails: Partial<User> = {
      username: "",
      forenames: "test-value-01",
      surname: "test-value-02",
      emailAddress: "test-value-04"
    }

    const { isFormValid, forenamesError, surnameError, emailError, usernameError } = userFormIsValid(userDetails, false)

    expect(isFormValid).toBe(false)
    expect(forenamesError).toBe(false)
    expect(surnameError).toBe(false)
    expect(usernameError).toBe("Enter a username for the new user")
    expect(emailError).toBe(false)
  })

  it("should return false when username is whitespace", () => {
    const userDetails: Partial<User> = {
      username: " ",
      forenames: "test-value-01",
      surname: "test-value-02",
      emailAddress: "test-value-04"
    }

    const { isFormValid, forenamesError, surnameError, emailError, usernameError } = userFormIsValid(userDetails, false)

    expect(isFormValid).toBe(false)
    expect(forenamesError).toBe(false)
    expect(surnameError).toBe(false)
    expect(usernameError).toBe("Enter a username for the new user")
    expect(emailError).toBe(false)
  })

  it("should return false when forenames is empty", () => {
    const userDetails: Partial<User> = {
      username: "test-value-01",
      forenames: "",
      surname: "test-value-02",
      emailAddress: "test-value-04"
    }

    const { isFormValid, forenamesError, surnameError, emailError, usernameError } = userFormIsValid(userDetails, false)

    expect(isFormValid).toBe(false)
    expect(forenamesError).toBe("Enter the user's forename(s)")
    expect(surnameError).toBe(false)
    expect(usernameError).toBe(false)
    expect(emailError).toBe(false)
  })

  it("should return false when forenames is whitespace", () => {
    const userDetails: Partial<User> = {
      username: "test-value-01",
      forenames: " ",
      surname: "test-value-02",
      emailAddress: "test-value-04"
    }

    const { isFormValid, forenamesError, surnameError, emailError, usernameError } = userFormIsValid(userDetails, false)

    expect(isFormValid).toBe(false)
    expect(forenamesError).toBe("Enter the user's forename(s)")
    expect(surnameError).toBe(false)
    expect(usernameError).toBe(false)
    expect(emailError).toBe(false)
  })

  it("should return false when surname is empty", () => {
    const userDetails: Partial<User> = {
      username: "test-value-01",
      forenames: "test-value-02",
      surname: "",
      emailAddress: "test-value-04"
    }

    const { isFormValid, forenamesError, surnameError, emailError, usernameError } = userFormIsValid(userDetails, false)

    expect(isFormValid).toBe(false)
    expect(forenamesError).toBe(false)
    expect(surnameError).toBe("Enter the user's surname")
    expect(usernameError).toBe(false)
    expect(emailError).toBe(false)
  })

  it("should return false when surname is whitespace", () => {
    const userDetails: Partial<User> = {
      username: "test-value-01",
      forenames: "test-value-02",
      surname: " ",
      emailAddress: "test-value-04"
    }

    const { isFormValid, forenamesError, surnameError, emailError, usernameError } = userFormIsValid(userDetails, false)

    expect(isFormValid).toBe(false)
    expect(forenamesError).toBe(false)
    expect(surnameError).toBe("Enter the user's surname")
    expect(usernameError).toBe(false)
    expect(emailError).toBe(false)
  })

  it("should return false when emailAddress is empty", () => {
    const userDetails: Partial<User> = {
      username: "test-value-01",
      forenames: "test-value-02",
      surname: "test-value-03",
      emailAddress: ""
    }

    const { isFormValid, forenamesError, surnameError, emailError, usernameError } = userFormIsValid(userDetails, false)

    expect(isFormValid).toBe(false)
    expect(forenamesError).toBe(false)
    expect(surnameError).toBe(false)
    expect(usernameError).toBe(false)
    expect(emailError).toBe("Enter the user's email address")
  })

  it("should return false when emailAddress is whitespace", () => {
    const userDetails: Partial<User> = {
      username: "test-value-01",
      forenames: "test-value-02",
      surname: "test-value-03",
      emailAddress: " "
    }

    const { isFormValid, forenamesError, surnameError, emailError, usernameError } = userFormIsValid(userDetails, false)

    expect(isFormValid).toBe(false)
    expect(forenamesError).toBe(false)
    expect(surnameError).toBe(false)
    expect(usernameError).toBe(false)
    expect(emailError).toBe("Enter the user's email address")
  })

  it("should return true when all relevant fields are valid", () => {
    const userDetails: Partial<User> = {
      username: "test-value-01",
      forenames: "test-value-02",
      surname: "test-value-03",
      emailAddress: "test-value-05"
    }

    const { isFormValid, forenamesError, surnameError, emailError, usernameError } = userFormIsValid(userDetails, false)

    expect(isFormValid).toBe(true)
    expect(forenamesError).toBe(false)
    expect(surnameError).toBe(false)
    expect(usernameError).toBe(false)
    expect(emailError).toBe(false)
  })
})
