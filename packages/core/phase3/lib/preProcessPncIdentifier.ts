const preProcessPncIdentifier = (pncIdentifier?: string) => {
  if (!pncIdentifier) {
    return null
  }

  if (process.env.USE_LEDS === "true") {
    const [year, id] = pncIdentifier.split("/")
    return `${year.substring(2)}/${id.replace(/^0+/, "")}`
  }

  const { year, identifier } = pncIdentifier.match(/\d{2}(?<year>\d{2})\/0*(?<identifier>.+)/)?.groups ?? {}

  return `${year}/${identifier}`
}

export default preProcessPncIdentifier
