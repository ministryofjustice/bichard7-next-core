import type { LedsBichard } from "../../types/LedsMock"
import type CaseData from "../../types/LedsTestApiHelper/CaseData"
import type { Charge, DisposalEntry } from "../../types/LedsTestApiHelper/DisposalHistoryResponse"
import type OffenceResponse from "../../types/LedsTestApiHelper/OffenceResponse"

const chargeKeys = ["offenceDescription", "offenceChargeNumber", "additionalMarker"]
const otherChargedKeys = ["checkName", "pncPersonId", "lastName", "firstNames"]
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
  "additionalOffenceMarker",
  "npccOffenceCode",
  "cjsOffenceCode",
  "qualifiedCjsCode",
  "startDate",
  "endDate",
  "roleQualifier",
  "legislationQualifier"
]
const disposalKeys = ["court", "convictionDate", "courtCaseReference", "caseStatusMarker", "userReference"]
const subsequentAppearanceKeys = ["appearanceNumber", "court", "sentenceDate", "reasonForVariation"]
const disposalResultKeys = ["disposalCode", "disposalQualifierCodes", "fineAmount", "disposalDuration"]
const remandKeys = [
  "appearanceResult",
  "ownerCode",
  "remandDate",
  "currentAppearance",
  "nextAppearance",
  "remandConditions"
]

const mapKeys = <T>(obj: T, keysToMap: string[]) =>
  keysToMap.reduce(
    (acc, key) => {
      const value = (obj as Record<string, unknown>)[key]
      if (value !== undefined) {
        acc[key] = value
      }

      return acc
    },
    {} as Record<string, unknown>
  )

const convertCharge = (ledsCharge: Charge, ledsOffence: OffenceResponse) => ({
  ...mapKeys(ledsCharge, chargeKeys),
  ...mapKeys(ledsOffence, offenceKeys),
  othersCharged: ledsOffence.othersCharged?.map((otherCharged) => mapKeys(otherCharged, otherChargedKeys)),
  results: ledsCharge.disposals.map((ledsDisposal) => mapKeys(ledsDisposal, disposalResultKeys))
})

const convertDisposal = (ledsDisposal: DisposalEntry, ledsOffences: OffenceResponse[]) => {
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

  return {
    ...mapKeys(ledsDisposal, disposalKeys),
    charges,
    subsequentAppearances
  }
}

const fetchCaseDataFromLedsApi = async (bichard: LedsBichard): Promise<CaseData> => {
  const ledsDisposals = await bichard.policeApi.testApiHelper.fetchDisposals()
  const [ledsOffences, ledsRemands] = await bichard.policeApi.testApiHelper.fetchRemandsAndOffences()
  ledsDisposals.forEach((disposal) => {
    disposal.charges.forEach((charge) => {
      charge.offence = ledsOffences.find((offence) => offence.id === charge.offenceId)
    })
  })

  const disposals = ledsDisposals.map((ledsDisposal) => convertDisposal(ledsDisposal, ledsOffences))
  const remands = ledsRemands.map((ledsRemand) => mapKeys(ledsRemand, remandKeys))

  return { disposals, remands }
}

export default fetchCaseDataFromLedsApi
