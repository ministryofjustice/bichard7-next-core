export const formatUserFullName = (forenames: string | undefined, surname: string | undefined): string => {
  return `${forenames || ""} ${surname || ""}`
}
