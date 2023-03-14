const notGuiltyVerdicts = ["NG", "NC", "NA"]

const isNotGuiltyVerdict = (verdict: string | undefined): boolean => notGuiltyVerdicts.includes(verdict ?? "")

export default isNotGuiltyVerdict
