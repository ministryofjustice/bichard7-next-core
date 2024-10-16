import { forces } from "@moj-bichard7-developers/bichard7-next-data"

// prettier-ignore
const forceCodesForReallocation = [
    "01", "02", "03", "04", "05", "06", "07", "10", "11", "12", "13", "14", "16", "17", "20", "21", "22", 
    "23", "24", "30", "31", "32", "33", "34", "35", "36", "37", "40", "41", "42", "43", "44", "45", "46", 
    "47", "48", "50", "52", "53", "54", "55", "60", "61", "62", "63", "67", "88", "89", "91", "93"
  ]

const getForcesForReallocation = (currentForceCode?: string) =>
  forces.filter((force) => force.code !== currentForceCode && forceCodesForReallocation.includes(force.code))

export { forceCodesForReallocation }
export default getForcesForReallocation
