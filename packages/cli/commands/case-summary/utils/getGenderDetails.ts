type Gender = {
  cjsCode: string
  description: string
  pncCode: string
  spiCode: string
  xhibitCode: string
}

let genders: Gender[] = []

const getGenderDetails = async (spiGenderCode?: string | number): Promise<string> => {
  if (!spiGenderCode) {
    return "Not provided"
  }

  if (genders.length === 0) {
    const gendersResult = await fetch(
      "https://raw.githubusercontent.com/ministryofjustice/bichard7-next-data/refs/heads/main/output-data/data/gender.json"
    )
    genders = await gendersResult.json()
  }

  let title = ""
  const gender = genders.find((g) => g.spiCode === String(spiGenderCode))
  if (gender) {
    title = gender.description[0].toUpperCase() + gender.description.slice(1)
  }

  return title ? `${title} (${spiGenderCode})` : String(spiGenderCode)
}

export default getGenderDetails
