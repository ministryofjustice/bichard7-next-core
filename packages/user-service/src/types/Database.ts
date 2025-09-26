import type { IDatabase } from "pg-promise"
import type pg from "pg-promise/typescript/pg-subset"

type Database = IDatabase<{}, pg.IClient>

export default Database
