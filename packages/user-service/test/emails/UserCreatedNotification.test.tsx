import UserCreatedNotification from "emails/UserCreatedNotification"
import User from "types/User"

describe("WHEN UserCreatedNotification is created", () => {
  describe("AND valid arguments are passed through", () => {
    let validUser: Partial<User>
    beforeEach(() => {
      // Given
      validUser = {
        username: "testUser",
        forenames: "testForename",
        surname: "testSurname",
        emailAddress: "test@test.com",
        endorsedBy: "testEndorser",
        groups: [{ id: "1", name: "B7Allocator", friendly_name: "Allocator" }],
        orgServes: "testOrg"
      }
    })

    it("SHOULD contain all necessary information", () => {
      // When
      const result = UserCreatedNotification({ user: validUser })
      // Then
      expect(result.text).toBeTruthy()
      expect(result.text).toContain(validUser.forenames)
      expect(result.text).toContain(validUser.surname)
      expect(result.text).toContain(validUser.emailAddress)
      expect(result.text).toContain(validUser.endorsedBy)
      expect(result.text).toContain(validUser.groups ? validUser.groups[0].friendly_name : [])
    })

    it("SHOULD use the friendly name when outputting groups", () => {
      // When
      const result = UserCreatedNotification({ user: validUser })
      // Then
      expect(result.text).toBeTruthy()
      expect(result.text).toContain(validUser.groups ? validUser.groups[0].friendly_name : [])
    })

    it("SHOULD trim the trailing comma for the groups output", () => {
      // When
      const result = UserCreatedNotification({ user: validUser })
      // Then
      expect(result.text).toBeTruthy()
      expect(result.text).toContain("Permissions Groups: Allocator")
      expect(result.text).not.toContain("Permissions Groups: Allocator,")
    })

    it("SHOULD only provide a text version of the email", () => {
      // When
      const result = UserCreatedNotification({ user: validUser })
      // Then
      expect(result.text).toBeTruthy()
      expect(result.html).toBeFalsy()
    })
  })
})
