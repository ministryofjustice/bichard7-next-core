import { IDatabase } from "pg-promise"
import pg from "pg-promise/typescript/pg-subset"

// eslint-disable-next-line @typescript-eslint/ban-types
type Database = IDatabase<{}, pg.IClient>

export default Database
