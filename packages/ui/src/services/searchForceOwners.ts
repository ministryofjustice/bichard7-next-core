import getForcesForReallocation from "./getForcesForReallocation"
import { sortBy } from "lodash"
import type { Force } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"

export const getForceCode = (force: Force) => `${force.code}`

export const getForceName = (force: Force) => [force.name].filter((part) => !!part).join(" ")

export const getForceOwnerCodeAndName = (force: Force) => `${getForceCode(force)} ${getForceName(force)}`

const searchForceOwners = (currentForceOwner: string, keyword: string) => {
  if (currentForceOwner === "" || keyword === "") {
    return []
  }

  const sortedForceOwners = sortBy(getForcesForReallocation(currentForceOwner), (force) => force.code)

  return sortedForceOwners.filter((force) =>
    getForceOwnerCodeAndName(force).toLowerCase().includes(keyword.replace(" - ", " ").toLowerCase())
  )
}

export default searchForceOwners
