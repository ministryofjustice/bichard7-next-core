import pgPromise from "pg-promise"
import Database from "types/Database"
import logger from "utils/logger"
import DatabaseConfig from "./DatabaseConfig"

/* eslint-disable @typescript-eslint/no-explicit-any */

const createSingletonConnection = (name: string, config: DatabaseConfig, attachEvents: boolean): Database => {
  const connectionName = Symbol.for(name)
  let scope = (global as any)[connectionName]

  if (!scope) {
    scope = pgPromise(
      attachEvents
        ? {
            query(e) {
              logger.info(`QUERY: ${e.query} PARAMS: ${e.params}`)
            },
            error(err, e) {
              logger.error(err)

              if (e.cn) {
                logger.error(`CONNECTION ERROR. QUERY: ${e.query}. PARAMS: ${e.params}`)
              }

              if (e.query) {
                logger.error(`QUERY ERROR: QUERY: ${e.query} PARAMS: ${e.params}`)
              }

              if (e.ctx) {
                logger.error(`CONTEXT: ${e.ctx}`)
              }
            }
          }
        : {}
    )({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      ssl: config.ssl ? { rejectUnauthorized: false } : false
    })
    ;(global as any)[connectionName as any] = scope
  }

  return scope
}

export default createSingletonConnection
