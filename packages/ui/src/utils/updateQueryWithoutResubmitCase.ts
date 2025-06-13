export const updateQueryWithoutResubmitCase = (basePath: string, url: string): string => {
  const [path, query] = url.split("?")
  const params = new URLSearchParams(query)

  // Remove this param as it causes the POST notes to fail
  params.delete("resubmitCase")

  return `${basePath}${path}?${params}`
}
