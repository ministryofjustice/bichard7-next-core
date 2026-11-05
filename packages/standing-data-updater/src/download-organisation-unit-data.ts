import downloadCjsOuCodes from "./organisation-unit-download/downloadCjsOuCodes"

const main = async () => {
  await downloadCjsOuCodes()
}

main()
  .then(() => console.log("Organisation Unit data is downloaded"))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
