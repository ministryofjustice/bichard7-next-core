const formatDateSpecifiedInResult = (date: Date, removeSlashes?: boolean) => {
  const formattedDate = date.toLocaleDateString("en-GB", { year: "numeric", month: "2-digit", day: "2-digit" })

  if (removeSlashes) {
    return formattedDate.replace(/\//gm, "")
  }

  return formattedDate
}

export default formatDateSpecifiedInResult
