import { forces } from "@moj-bichard7-developers/bichard7-next-data/"
import { forceCodesForReallocation } from "./getForcesForReallocation"
import { sortBy } from "lodash"
import type { Force } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"

export const getForceCode = (force: Force) => `${force.code}`

export const getForceName = (force: Force) =>
  [force.name]
    .filter((part) => !!part) //here?
    .join(" ") //here?

export const getForceOwnerCodeAndName = (force: Force) => `${getForceCode(force)} ${getForceName(force)}`

const forceOwners: Force[] = forces.filter((force) => forceCodesForReallocation.includes(force.code))
const sortedForceOwners = sortBy(forceOwners, (force) => force.code)

const searchForceOwners = (keyword: string): Force[] => {
  return keyword === ""
    ? []
    : sortedForceOwners.filter((force) => getForceOwnerCodeAndName(force).toLowerCase().includes(keyword.toLowerCase()))
}

export default searchForceOwners
