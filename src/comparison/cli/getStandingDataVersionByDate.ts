const getStandingDataVersionByDate = (date: Date) => {
  if (date < new Date("2022-07-13")) {
    return "2.0.20"
  }
  if (date < new Date("2022-07-23")) {
    return "2.0.21"
  }

  return "latest"
}

export default getStandingDataVersionByDate
