import type Exception from "@moj-bichard7/common/types/Exception"

import orderBy from "lodash.orderby"

const sortExceptions = (exceptions: Exception[]): Exception[] => orderBy(exceptions, ["code", "path", "message"])

export default sortExceptions
