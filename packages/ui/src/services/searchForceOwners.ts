import type { Force } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"
import { sortBy } from "lodash"
import getForcesForReallocation from "./getForcesForReallocation"

export const getForceCode = (force: Force) => force.code

export const getForceName = (force: Force) => [force.name].filter((part) => !!part).join(" ")

const forceNameAcronymMappings: Record<string, string> = {
  "06": "GMP",
  67: "SOCA",
  89: "ACRO",
  91: "NCA",
  93: "British Transport Police"
}

export const getForceAcronym = (forceCode: string) => {
  const acronym = forceNameAcronymMappings[forceCode]
  if (acronym) {
    return acronym
  } else {
    return ""
  }
}

export const getForceOwnerCodeNameAcronym = (force: Force) => {
  const acronym = getForceAcronym(force.code)

  if (acronym) {
    return `${getForceCode(force)} ${getForceName(force)} ${acronym}`
  } else {
    return `${getForceCode(force)} ${getForceName(force)}`
  }
}

const searchForceOwners = (currentForceOwner: string, keyword: string) => {
  if (currentForceOwner === "" || keyword === "") {
    return []
  }

  const sortedForceOwners = sortBy(getForcesForReallocation(currentForceOwner), (force) => force.code)

  return sortedForceOwners.filter((force) => {
    return getForceOwnerCodeNameAcronym(force)
      .toLowerCase()
      .includes(keyword.replace(" - ", " ").replace("(", "").replace(")", "").toLowerCase())
  })
}

export default searchForceOwners
