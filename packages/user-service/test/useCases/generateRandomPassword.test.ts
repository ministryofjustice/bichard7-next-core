import generateRandomPassword from "useCases/generateRandomPassword"

const expectedMinimumPasswordLength = 8

it("should never generate a string smaller than 8 characters and different each time", () => {
  const password1 = generateRandomPassword()
  expect(password1.length).toBeGreaterThan(expectedMinimumPasswordLength)
  const password2 = generateRandomPassword()
  expect(password2.length).toBeGreaterThan(expectedMinimumPasswordLength)
  const password3 = generateRandomPassword()
  expect(password3.length).toBeGreaterThan(expectedMinimumPasswordLength)

  expect(password1 === password2).toBe(false)
  expect(password1 === password3).toBe(false)
  expect(password3 === password2).toBe(false)
})
