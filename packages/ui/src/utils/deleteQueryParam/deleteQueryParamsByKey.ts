const deleteQueryParamsByKey = (keysToRemove: string[], query: URLSearchParams): URLSearchParams => {
  keysToRemove.forEach((key: string) => query.delete(key))
  return query
}

export default deleteQueryParamsByKey
