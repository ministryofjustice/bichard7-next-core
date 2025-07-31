import orderBy from "lodash.orderby"

import type Exception from "../../types/Exception"

const sortExceptions = (exceptions: Exception[]): Exception[] => orderBy(exceptions, ["code", "path", "message"])

export default sortExceptions
