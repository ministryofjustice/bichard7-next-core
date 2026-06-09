import type { DatabaseConnection } from "../../../types/DatabaseGateway"

export default (database: DatabaseConnection, visibleForces: string[]) => {
  const sql = database.connection

  const forceClauses = visibleForces.map((f) => {
    const trimmedForceCode = f.replace(/^0+(\d+)/, "$1")

    const visibleForce = String.raw`\y0+${trimmedForceCode}\y`

    return sql`u.visible_forces ~ ${visibleForce}`
  })

  let forceWhere = forceClauses[0]

  if (forceClauses.length > 1) {
    for (let i = 1; i <= forceClauses.length - 1; i++) {
      forceWhere = sql`${forceWhere} OR ${forceClauses[i]}`
    }
  }

  return forceWhere
}
