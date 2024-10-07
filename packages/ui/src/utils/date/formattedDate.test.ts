import { formatDisplayedDate, formatFormInputDateString, formatStringDateAsDisplayedDate } from "./formattedDate"

describe("formatDisplayedDate", () => {
  it("can format a date in 'dd/MM/yyyy' format", () => {
    expect(formatDisplayedDate(new Date("2023-01-01"))).toStrictEqual("01/01/2023")
  })

  it("can handle when users enter an invalid date", () => {
    expect(formatDisplayedDate(new Date("202344444-01-01"))).toStrictEqual("")
  })

  it("can format a date string in 'dd/MM/yyyy' format", () => {
    expect(formatDisplayedDate("2023-01-01")).toStrictEqual("01/01/2023")
  })

  it("can handle when users enter an invalid date string(users need to see the invalid value)", () => {
    expect(formatDisplayedDate("not a real date")).toStrictEqual("not a real date")
  })
})

describe("formatFormInputDateString", () => {
  it("can format a date in '2023-01-01' format", () => {
    expect(formatFormInputDateString(new Date("01/01/2023"))).toStrictEqual("2023-01-01")
  })

  it("can handle when users enter an invalid date", () => {
    expect(formatFormInputDateString(new Date("202344444-01-01"))).toStrictEqual("")
  })
})

describe("formatStringDateAsDisplayedDate", () => {
  it("can convert date string 'yyyy-MM-dd' to 'dd/MM/yyyy'", () => {
    expect(formatStringDateAsDisplayedDate("2023-01-01")).toStrictEqual("01/01/2023")
  })

  it("can handle when users enter an invalid date string", () => {
    expect(formatStringDateAsDisplayedDate("202344444-01-01")).toStrictEqual("")
    expect(formatStringDateAsDisplayedDate("01/01/2023")).toStrictEqual("")
    expect(formatStringDateAsDisplayedDate("Invalid date")).toStrictEqual("")
  })
})
