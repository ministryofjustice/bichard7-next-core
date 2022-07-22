// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type StandingData = typeof import("bichard7-next-data-latest").default

const requireStandingData = (): StandingData => {
  const version = process.env.DATA_VERSION || "latest"
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require(`bichard7-next-data-${version}`).default
}

export default requireStandingData
