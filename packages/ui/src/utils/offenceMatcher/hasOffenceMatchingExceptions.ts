import { Exception } from "types/exceptions"
import getOffenceMatchingExceptions from "./getOffenceMatchingExceptions"

const hasOffenceMatchingExceptions = (exceptions: Exception[]) => getOffenceMatchingExceptions(exceptions).length > 0

export default hasOffenceMatchingExceptions
