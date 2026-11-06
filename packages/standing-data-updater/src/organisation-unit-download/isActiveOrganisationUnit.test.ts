import MockDate from "mockdate"
import isActiveOrganisationUnit from "./isActiveOrganisationUnit"

afterEach(() => {
  MockDate.reset()
})

describe("isActiveOrganisationUnit", () => {
  test.each([
    {
      data: {
        startDate: "2022-05-11",
        endDate: "2022-05-14"
      },
      result: true
    },
    {
      data: {
        startDate: "2022-05-13",
        endDate: "2022-05-14"
      },
      result: true
    },
    {
      data: {
        startDate: "2022-05-13",
        endDate: ""
      },
      result: true
    },
    {
      data: {
        startDate: "",
        endDate: "2022-05-14"
      },
      result: false
    },
    {
      data: {
        startDate: "2022-05-12",
        endDate: "bad data"
      },
      result: true
    }
  ])("should record data when the current time is within start and end dates %s", (record) => {
    MockDate.set(new Date("2022-05-13").getTime())

    expect(isActiveOrganisationUnit(record.data.startDate, record.data.endDate)).toBe(record.result)
  })
})
