import cjsDownload from "./cjs-download"
import pnldDownload from "./pnld-download"

const main = async () => {
  await pnldDownload()
  await cjsDownload()
}

main()
  .then(() => console.log("All data downloaded"))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
