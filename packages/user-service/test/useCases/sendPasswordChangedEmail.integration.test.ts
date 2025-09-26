/**
 * @jest-environment node
 */

import { isError } from "types/Result"
import getEmailer from "lib/getEmailer"
import sendPasswordChangedEmail from "useCases/sendPasswordChangedEmail"
import Database from "types/Database"
import getTestConnection from "../../testFixtures/getTestConnection"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import insertIntoTable from "../../testFixtures/database/insertIntoUsersTable"
import users from "../../testFixtures/database/data/users"

jest.mock("lib/getEmailer")

describe("sendPasswordChangedEmail", () => {
  let connection: Database

  beforeAll(() => {
    connection = getTestConnection()
  })

  beforeEach(async () => {
    await deleteFromTable("users")
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should send the email when user exists", async () => {
    await insertIntoTable(users)

    const mockedGetEmailer = getEmailer as jest.MockedFunction<typeof getEmailer>
    const mockedSendMail = jest.fn().mockResolvedValue(null)
    mockedGetEmailer.mockReturnValue({ sendMail: mockedSendMail })

    const result = await sendPasswordChangedEmail(connection, "bichard01@example.com", "http://localhost:3000")

    expect(isError(result)).toBe(false)
    expect(mockedSendMail).toHaveBeenCalledTimes(1)
  })

  it("should not send the email and not return error when user does not exist", async () => {
    const mockedGetEmailer = getEmailer as jest.MockedFunction<typeof getEmailer>
    const mockedSendMail = jest.fn().mockResolvedValue(null)
    mockedGetEmailer.mockReturnValue({ sendMail: mockedSendMail })

    const result = await sendPasswordChangedEmail(connection, "bichard01@example.com")

    expect(isError(result)).toBe(false)
    expect(mockedSendMail).not.toHaveBeenCalled()
  })

  it("should not send email and not return error when user is deleted", async () => {
    const user = [users[0]].map((u) => ({
      ...u,
      deleted_at: new Date(),
      password: "somepassword"
    }))

    await insertIntoTable(user)

    const mockedGetEmailer = getEmailer as jest.MockedFunction<typeof getEmailer>
    const mockedSendMail = jest.fn().mockResolvedValue(null)
    mockedGetEmailer.mockReturnValue({ sendMail: mockedSendMail })

    const result = await sendPasswordChangedEmail(connection, "bichard01@example.com")

    expect(isError(result)).toBe(false)
    expect(mockedSendMail).not.toHaveBeenCalled()
  })

  it("should return error when it fails to send the email", async () => {
    await insertIntoTable(users)

    const expectedError = Error("Expected error message")
    const mockedGetEmailer = getEmailer as jest.MockedFunction<typeof getEmailer>
    // eslint-disable-next-line require-await
    const mockedSendMail = jest.fn().mockImplementation(async () => {
      throw expectedError
    })
    mockedGetEmailer.mockReturnValue({ sendMail: mockedSendMail })

    const result = await sendPasswordChangedEmail(connection, "bichard01@example.com", "http://localhost:3000")

    expect(isError(result)).toBe(true)

    const actualError = result as Error
    expect(actualError.message).toBe(expectedError.message)
  })
})
