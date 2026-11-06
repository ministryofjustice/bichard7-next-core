import mergeOrganisationUnitData from "./organisation-unit-download/mergeOrganisationUnitData"

const main = async () => {
  await mergeOrganisationUnitData()
}

main()
  .then(() => console.log("Organisation Unit data is downloaded"))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
