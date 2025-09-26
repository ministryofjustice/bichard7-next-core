import { isError } from "types/Result"
import Database from "types/Database"
import getServiceMessages from "useCases/getServiceMessages"
import PaginatedResult from "types/PaginatedResult"
import ServiceMessage from "types/ServiceMessage"
import getTestConnection from "../../testFixtures/getTestConnection"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import insertIntoTable from "../../testFixtures/database/insertIntoServiceMessagesTable"
import data from "../../testFixtures/database/data/serviceMessages"

describe("getServiceMessages", () => {
  let connection: Database

  beforeAll(() => {
    connection = getTestConnection()
  })

  beforeEach(async () => {
    await deleteFromTable("service_messages")
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should return correct service messages from the database", async () => {
    await insertIntoTable(data)

    const pageOneResult = await getServiceMessages(connection, 0)
    expect(isError(pageOneResult)).toBe(false)

    const pageOne = pageOneResult as PaginatedResult<ServiceMessage[]>

    expect(pageOne.totalElements).toBe(7)
    expect(pageOne.result).toHaveLength(5)

    const pageOneItems = pageOne.result
    for (let i = 0; i < pageOneItems.length; i++) {
      expect(pageOneItems[i].message).toBe(`Message ${data.length - i}`)
    }

    const pageTwoResult = await getServiceMessages(connection, 1)
    expect(isError(pageTwoResult)).toBe(false)

    const pageTwo = pageTwoResult as PaginatedResult<ServiceMessage[]>

    expect(pageTwo.totalElements).toBe(7)
    expect(pageTwo.result).toHaveLength(2)

    const pageTwoItems = pageTwo.result
    for (let i = 0; i < pageTwoItems.length; i++) {
      expect(pageTwoItems[i].message).toBe(`Message ${data.length - i - 5}`)
    }
  })

  it("should return service messages that have incident date less than 30 days in the future", async () => {
    const getDate = (daysToAddOrSubtract: number) => new Date(Date.now() + daysToAddOrSubtract * 24 * 3_600 * 1_000)

    await insertIntoTable([
      {
        message: "Incident_date is less than 30 days in the future",
        created_at: new Date(),
        incident_date: getDate(10)
      },
      {
        message: "Incident_date is 30 days in the future",
        created_at: new Date(),
        incident_date: getDate(30)
      },
      {
        message: "Incident_date is more than 30 days in the future",
        created_at: new Date(),
        incident_date: getDate(31)
      },
      {
        message: "Incident_date is in the past",
        created_at: new Date(),
        incident_date: getDate(-1)
      },
      {
        message: "Incident_date has not been set, created_at is 30 days in the future",
        created_at: getDate(30),
        incident_date: null
      },
      {
        message: "Incident_date has not been set, created_at is less than 30 days in the future",
        created_at: getDate(10),
        incident_date: null
      },
      {
        message: "Incident_date has not been set, created_at is more than 30 days in the future",
        created_at: getDate(31),
        incident_date: null
      },
      {
        message: "Incident_date has not been set, created_at is more than 30 days in the past",
        created_at: getDate(-31),
        incident_date: null
      },
      {
        message: "Incident_date has not been set, created_at is 30 days in the past",
        created_at: getDate(-30),
        incident_date: null
      },
      {
        message: "Incident_date has not been set, created_at is less than 30 days in the past",
        created_at: getDate(-29),
        incident_date: null
      }
    ])

    const pageOneResult = (await getServiceMessages(connection, 0)) as PaginatedResult<ServiceMessage[]>
    const pageTwoResult = (await getServiceMessages(connection, 1)) as PaginatedResult<ServiceMessage[]>
    expect(isError(pageOneResult)).toBe(false)
    expect(isError(pageTwoResult)).toBe(false)

    const serviceMessages = [...pageOneResult.result, ...pageTwoResult.result]

    expect(serviceMessages).toHaveLength(7)
    expect(serviceMessages).toContainEqual({
      id: expect.anything(),
      message: "Incident_date is less than 30 days in the future",
      createdAt: expect.anything(),
      incidentDate: expect.anything(),
      allMessages: "7"
    })
    expect(serviceMessages).toContainEqual({
      id: expect.anything(),
      message: "Incident_date is 30 days in the future",
      createdAt: expect.anything(),
      incidentDate: expect.anything(),
      allMessages: "7"
    })
    expect(serviceMessages).toContainEqual({
      id: expect.anything(),
      message: "Incident_date has not been set, created_at is less than 30 days in the future",
      createdAt: expect.anything(),
      incidentDate: null,
      allMessages: "7"
    })
    expect(serviceMessages).toContainEqual({
      id: expect.anything(),
      message: "Incident_date has not been set, created_at is 30 days in the future",
      createdAt: expect.anything(),
      incidentDate: null,
      allMessages: "7"
    })
    expect(serviceMessages).toContainEqual({
      id: expect.anything(),
      message: "Incident_date has not been set, created_at is more than 30 days in the future",
      createdAt: expect.anything(),
      incidentDate: null,
      allMessages: "7"
    })
    expect(serviceMessages).toContainEqual({
      id: expect.anything(),
      message: "Incident_date has not been set, created_at is 30 days in the past",
      createdAt: expect.anything(),
      incidentDate: null,
      allMessages: "7"
    })
    expect(serviceMessages).toContainEqual({
      id: expect.anything(),
      message: "Incident_date has not been set, created_at is less than 30 days in the past",
      createdAt: expect.anything(),
      incidentDate: null,
      allMessages: "7"
    })
  })
})
