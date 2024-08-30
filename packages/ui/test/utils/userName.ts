import { capitalizeString } from "../../src/utils/valueTransformers"

export const formatForenames = (forenames: string) => {
  if (forenames) {
    return forenames
      .split(" ")
      .map((name) => capitalizeString(name))
      .join(" ")
  }

  return forenames
}

export const formatSurname = (surname: string) => {
  if (surname) {
    return capitalizeString(surname)
  }

  return surname
}
