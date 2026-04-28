const preProcessPersonUrn = (personUrn?: string): string | undefined => {
  if (!personUrn) {
    return undefined
  }

  const [year, id] = personUrn.split("/")
  if (!year || !id) {
    return undefined
  }

  return `${year.substring(2)}/${id.replace(/^0+/, "")}`
}

export default preProcessPersonUrn
