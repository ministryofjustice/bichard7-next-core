import usersHaveSameForce from "lib/usersHaveSameForce"

describe("usersHaveSameForce()", () => {
  it("should return true when the given users are both only in the same force", () => {
    const user1 = { visibleForces: "001" }
    const user2 = { visibleForces: "001" }
    expect(usersHaveSameForce(user1, user2)).toBe(true)
    expect(usersHaveSameForce(user2, user1)).toBe(true)
  })

  it("should return true when the given users have a single force in common", () => {
    const user1 = { visibleForces: "001,002" }
    const user2 = { visibleForces: "001,003" }
    expect(usersHaveSameForce(user1, user2)).toBe(true)
    expect(usersHaveSameForce(user2, user1)).toBe(true)
  })

  it("should return false when the given users have no forces in common", () => {
    const user1 = { visibleForces: "001,002" }
    const user2 = { visibleForces: "003,004" }
    expect(usersHaveSameForce(user1, user2)).toBe(false)
    expect(usersHaveSameForce(user2, user1)).toBe(false)
  })

  it("should return false when either of the given users have an empty force list", () => {
    const user1 = { visibleForces: "" }
    const user2 = { visibleForces: "001" }
    expect(usersHaveSameForce(user1, user2)).toBe(false)
    expect(usersHaveSameForce(user2, user1)).toBe(false)
  })

  it("should return false when either of the given users have no force list", () => {
    const user1 = {}
    const user2 = { visibleForces: "001" }
    expect(usersHaveSameForce(user1, user2)).toBe(false)
    expect(usersHaveSameForce(user2, user1)).toBe(false)
  })
})
