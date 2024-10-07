import { DisplayFullCourtCase } from "../../types/display/CourtCases"

const isDateString = (value: string): boolean =>
  typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)

const parseCourtCaseWithDateObjects = (courtCase: DisplayFullCourtCase) =>
  JSON.parse(JSON.stringify(courtCase), (_, value) => {
    return isDateString(value) ? new Date(value) : value
  })

export default parseCourtCaseWithDateObjects
