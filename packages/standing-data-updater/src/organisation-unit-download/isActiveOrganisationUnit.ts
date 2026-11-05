import valueToDate from "./valueToDate"

const isActiveOrganisationUnit = (start?: string, end?: string): boolean => {
  const startDate = valueToDate(start)
  const endDate = valueToDate(end)
  const currentDate = new Date()

  return (
    !!startDate &&
    startDate.getTime() <= currentDate.getTime() &&
    (endDate === undefined || endDate.getTime() >= currentDate.getTime())
  )
}

export default isActiveOrganisationUnit
