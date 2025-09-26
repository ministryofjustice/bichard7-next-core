import type User from "types/User"

export default function usersHaveSameForce(user1: Partial<User>, user2: Partial<User>): boolean {
  const user1Forces = user1.visibleForces?.split(",") ?? []
  const user2Forces = user2.visibleForces?.split(",") ?? []
  return user1Forces.some((force: string) => user2Forces.includes(force))
}
