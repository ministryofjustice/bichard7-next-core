import type { LedsBichard } from "../../types/LedsMock"
import type CaseData from "../../types/LedsTestApiHelper/CaseData"
import type OffenceResponse from "../../types/LedsTestApiHelper/OffenceResponse"
import type { Charge } from "../../types/PoliceData"

const chargeKeys = ["offenceDescription", "offenceChargeNumber", "additionalMarker"]
const offenceKeys = [
  "arrestSummonsReference",
  "arrestChargeNumber",
  "chargeStatusMarker",
  "committedOnBail",
  "plea",
  "courtCaseReferenceNumber",
  "courtCaseChargeNumber",
  "forceStationChargeOrig",
  "crimeReference",
  "locationFSCode",
  "locationAddress",
  "offencesTakenIntoConsideration",
  "adjudication",
  "othersCharged",
  "additionalOffenceMarker",
  "npccOffenceCode",
  "cjsOffenceCode",
  "qualifiedCjsCode",
  "startDate",
  "endDate",
  "roleQualifier",
  "legislationQualifier"
]

const convertCharge = (ledsCharge: Charge, ledsOffence: OffenceResponse) => {
  const charge = {} as Record<string, unknown>
  chargeKeys.forEach((chargeKey) => {
    charge[chargeKey] = (ledsCharge as Record<string, unknown>)[chargeKey]
  })
  offenceKeys.forEach((offenceKey) => {
    charge[offenceKey] = (ledsOffence as Record<string, unknown>)?.[offenceKey]
  })

  return charge
}

const mapKeys = <T>(obj: T, keysToMap: string[]) =>
  keysToMap.reduce(
    (acc, key) => {
      acc[key] = (obj as Record<string, unknown>)[key]
      return acc
    },
    {} as Record<string, unknown>
  )

const fetchCaseDataFromLedsApi = async (bichard: LedsBichard): Promise<CaseData> => {
  const ledsDisposals = await bichard.policeApi.testApiHelper.fetchDisposals()
  const [ledsOffences, ledsRemands] = await bichard.policeApi.testApiHelper.fetchRemandsAndOffences()
  ledsDisposals.forEach((disposal) => {
    disposal.charges.forEach((charge) => {
      charge.offence = ledsOffences.find((offence) => offence.id === charge.offenceId)
    })
  })

  const disposals = ledsDisposals.map((ledsDisposal) => {
    const disposalKeys = ["court", "convictionDate", "courtCaseReference", "caseStatusMarker"]
    const subsequentAppearanceKeys = ["appearanceNumber", "court", "sentenceDate", "reasonForVariation"]

    const charges = ledsDisposal.charges.map((ledsCharge) => {
      const ledsOffence = ledsOffences.find((offence) => offence.id === ledsCharge.offenceId)!
      return convertCharge(ledsCharge, ledsOffence)
    })

    const subsequentAppearances = ledsDisposal.subsequentAppearances?.map((ledsSubsequentAppearance) => {
      const subsequentAppearance = mapKeys(ledsSubsequentAppearance, subsequentAppearanceKeys)
      subsequentAppearance.charges = ledsSubsequentAppearance.charges.map((ledsCharge) => {
        const ledsOffence = ledsOffences.find((offence) => offence.id === ledsCharge.offenceId)!
        return convertCharge(ledsCharge, ledsOffence)
      })

      return subsequentAppearance
    })

    const disposal = mapKeys(ledsDisposal, disposalKeys)

    return {
      ...disposal,
      charges,
      subsequentAppearances
    }
  })

  return { disposals, remands: ledsRemands }
}

export default fetchCaseDataFromLedsApi
