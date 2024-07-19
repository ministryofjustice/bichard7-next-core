import { COMMON_LAWS, INDICTMENT } from "../../../lib/offenceTypes"

export default (nationalOffenceCode: { [x: string]: string }): boolean => {
  const regexes = [
    {
      name: "ActOrSource",
      pattern: new RegExp(/[A-Z]{2}/)
    },
    {
      name: "Year",
      pattern: new RegExp(/[0-9]{2}/)
    },
    {
      name: "Indictment",
      pattern: new RegExp(`${INDICTMENT}`)
    },
    {
      name: "CommonLawOffence",
      pattern: new RegExp(`${COMMON_LAWS}`)
    },
    {
      name: "Reason",
      pattern: new RegExp(/[0-9]{3}/)
    },
    {
      name: "Qualifier",
      pattern: new RegExp(/A|B|C|I/)
    }
  ]

  return regexes
    .filter((reg: { name: string; pattern: RegExp }) => reg.name in nationalOffenceCode)
    .every((reg) => reg.pattern.test(nationalOffenceCode[reg.name]))
}
