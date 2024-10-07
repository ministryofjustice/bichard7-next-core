import getForcesForReallocation, { forceCodesForReallocation } from "services/getForcesForReallocation"

describe("getForcesForReallocation", () => {
  it("Should return all forces for reallocation except the current force", () => {
    const currentForceCode = "67"
    const result = getForcesForReallocation(currentForceCode)

    expect(result).toHaveLength(forceCodesForReallocation.length - 1)
    expect(result.map((force) => force.code)).toStrictEqual(
      forceCodesForReallocation.filter((code) => code !== currentForceCode)
    )
  })

  it("Should return all forces for reallocation when current force code is not in reallocation list", () => {
    const currentForceCode = "08"
    const result = getForcesForReallocation(currentForceCode)

    expect(result).toHaveLength(forceCodesForReallocation.length)
    expect(result.map((force) => force.code)).toStrictEqual(forceCodesForReallocation)
  })
})
