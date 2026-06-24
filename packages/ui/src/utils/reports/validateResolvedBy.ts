import { FIELD_REQUIRED } from "./validationMessages"

export const validateResolvedBy = (resolvedBy: string[] | undefined): string | null => {
  return resolvedBy && resolvedBy.length > 0 ? null : FIELD_REQUIRED
}
