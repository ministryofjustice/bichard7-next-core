import orderBy from "lodash.orderby"
import type Exception from "../../types/Exception"

export const sortExceptions = (exceptions: Exception[]): Exception[] => orderBy(exceptions, ["code", "path"])
