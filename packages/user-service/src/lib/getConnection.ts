import Database from "types/Database"
import config from "./config"
import createSingletonConnection from "./createSingletonConnection"

const getConnection = (connectionName = "users-service-connection", attachEvents = false): Database => {
  return createSingletonConnection(connectionName, config.database, attachEvents)
}

export default getConnection
