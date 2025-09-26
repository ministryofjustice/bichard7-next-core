import type QueryString from "qs"

const updateUserCodes = (
  listOfCodes: { id: string; name: string }[],
  typeOfCodes: string,
  formData: QueryString.ParsedQs,
  include = true
): string => {
  return listOfCodes
    .filter((code) => {
      if (include) {
        return `${typeOfCodes}${code.id}` in formData
      }

      return !(`${typeOfCodes}${code.id}` in formData)
    })
    .map((code) => code.id)
    .join(",")
}

export default updateUserCodes
