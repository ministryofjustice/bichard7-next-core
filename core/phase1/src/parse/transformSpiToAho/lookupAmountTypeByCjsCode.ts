const lookup: { [k: string]: number[] } = {
  "Back duty": [3014],
  Costs: [3010, 3011, 3117, 5015],
  Compensation: [3012, 3013],
  "Compensation on a TIC": [],
  Confiscation: [3048, 3056],
  "Central funds costs": [],
  Fine: [
    1015, 1016, 1027, 1046, 1049, 1054, 1059, 1068, 1070, 1105, 1106, 1107, 1109, 1119, 1127, 1128, 1129, 1131, 1132,
    2021, 2062, 3038, 5020
  ],
  "Fine - daily penalty total": [],
  "Wasted costs": [],
  "Inter-partes costs": [],
  "Estreatment of recognisance": [1063, 1071, 1094, 3016]
}
const defaultAmountType = "Fine"

const lookupAmountTypeByCjsCode = (cjsCode: number): string | undefined => {
  for (const type of Object.keys(lookup)) {
    if (lookup[type].some((code) => code === cjsCode)) {
      return type
    }
  }
  return defaultAmountType
}

export default lookupAmountTypeByCjsCode
