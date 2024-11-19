const formatDateSpecifiedInResult = (date: Date, removeSlashes?: boolean) => {
  const formattedDate = date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })

  if (removeSlashes) {
    return formattedDate.replace(/\//gm, "")
  }

  return formattedDate
}

export default formatDateSpecifiedInResult
