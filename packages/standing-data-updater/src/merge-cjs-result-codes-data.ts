import mergeAndWriteCjsResultCodes from "./cjs-result-codes-download/mergeAndWriteCjsResultCodes"

const main = async () => {
  await mergeAndWriteCjsResultCodes()
}

main()
  .then(() => console.log("CJS Result codes merged"))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
