type OrganisationUnit = {
  bottomLevelCode: string
  bottomLevelName: string
  secondLevelCode: string
  secondLevelName: string
  thirdLevelCode: string
  thirdLevelName: string
  thirdLevelPsaCode: string
  topLevelCode: string
  topLevelName: string
}

let organisationUnits: OrganisationUnit[] = []

const fetchOrganisationUnits = async () => {
  if (organisationUnits.length === 0) {
    const organisationUnitsResult = await fetch(
      "https://raw.githubusercontent.com/ministryofjustice/bichard7-next-data/refs/heads/main/output-data/data/organisation-unit.json"
    )
    organisationUnits = await organisationUnitsResult.json()
  }
}

export const getCourtDetailsByLjaCode = async (ljaCode?: string | number): Promise<string> => {
  if (!ljaCode) {
    return "No code"
  }

  await fetchOrganisationUnits()

  let title = ""
  const organisationUnit = organisationUnits.find((ou) => ou.thirdLevelPsaCode === String(ljaCode))
  if (organisationUnit) {
    const { topLevelName, secondLevelName, thirdLevelName, bottomLevelName } = organisationUnit
    title = [topLevelName, secondLevelName, thirdLevelName, bottomLevelName].filter(Boolean).join(" ")
  }

  return title ? `${ljaCode} (${title})` : String(ljaCode)
}

export const getCourtDetailsByOrganisationUnit = async (orgUnit?: string): Promise<string> => {
  if (!orgUnit) {
    return "No organisation unit provided"
  }

  await fetchOrganisationUnits()

  let title = ""
  const topLevelCode = orgUnit[0]
  const secondLevelCode = orgUnit.slice(1, 3)
  const thirdLevelCode = orgUnit.slice(3, 5)
  const bottomLevelCode = orgUnit.slice(5, 7)
  const filteredOrganisationUnits = organisationUnits.filter(
    (ou) => ou.topLevelCode === topLevelCode && ou.secondLevelCode === secondLevelCode && ou.thirdLevelCode === thirdLevelCode
  )

  const organisationUnit = filteredOrganisationUnits.find((ou) => ou.bottomLevelCode === bottomLevelCode) ?? filteredOrganisationUnits[0]
  if (organisationUnit) {
    const { topLevelName, secondLevelName, thirdLevelName, bottomLevelName } = organisationUnit
    title = [topLevelName, secondLevelName, thirdLevelName, bottomLevelName].filter(Boolean).join(" ")
  }

  return title ? `${orgUnit} (${title})` : orgUnit
}
