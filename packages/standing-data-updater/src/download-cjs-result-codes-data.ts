import downloadCjsResultCodes from "./cjs-result-codes-download/downloadCjsResultCodes"

const main = async () => {
  await downloadCjsResultCodes()
}

main()
  .then(() => console.log("CJS Result Codes successfully downloaded"))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
