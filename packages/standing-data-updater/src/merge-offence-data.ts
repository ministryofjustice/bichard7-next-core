import fs from "node:fs/promises"
import { offenceCode as currentOffenceCodes } from "@moj-bichard7/standing-data"
import consistentSort from "./lib/consistentSort"
import createOffenceCodeLookup from "./lib/createOffenceCodeLookup"
import HomeOfficeClassificationPriority from "./merge/HomeOfficeClassificationPriority"
import NotifiableToHOPriority from "./merge/NotifiableToHOPriority"
import OffenceCategoryPriority from "./merge/OffenceCategoryPriority"
import OffenceCodeMerger from "./merge/OffenceCodeMerger"
import OffenceTitlePriority from "./merge/OffenceTitlePriority"
import RecordableOnPncPriority from "./merge/RecordableOnPncPriority"
import type { OffenceCode } from "./types/OffenceCode"
import { readFile } from "./lib/readFile"

const validOffenceCodeFilter = (oc: string): boolean => /^[0-9A-Za-z]+$/.test(oc)

const main = async () => {
  const cjsOffenceCodes = await readFile<OffenceCode[]>("../input-data/offence-code/cjs-offences.json")
  const pnldOffenceCodes = await readFile<OffenceCode[]>("../input-data/offence-code/pnld-offences.json")
  const pncOffenceCodes = await readFile<OffenceCode[]>("../input-data/offence-code/pnc-ccjs-cjs-offences.json")

  const currentOffenceCodeLookup = createOffenceCodeLookup(currentOffenceCodes)
  const cjsOffenceCodeLookup = createOffenceCodeLookup(cjsOffenceCodes)
  const pnldOffenceCodeLookup = createOffenceCodeLookup(pnldOffenceCodes)
  const pncOffenceCodeLookup = createOffenceCodeLookup(pncOffenceCodes)

  const allOffenceCodeKeys = new Set(
    Object.keys(currentOffenceCodeLookup)
      .concat(Object.keys(pnldOffenceCodeLookup), Object.keys(cjsOffenceCodeLookup), Object.keys(pncOffenceCodeLookup))
      .filter(validOffenceCodeFilter)
  )

  const hoClassification = new HomeOfficeClassificationPriority(currentOffenceCodeLookup, pnldOffenceCodeLookup)

  const notifiableToHo = new NotifiableToHOPriority(currentOffenceCodeLookup, pnldOffenceCodeLookup)

  const offenceCodeB7CategoryOverrides = await readFile<string[]>("../input-data/offence-code/b7-overrides.json")
  const offenceCategory = new OffenceCategoryPriority(
    currentOffenceCodeLookup,
    cjsOffenceCodeLookup,
    offenceCodeB7CategoryOverrides,
    pnldOffenceCodeLookup,
    pncOffenceCodeLookup
  )

  const offenceTitle = new OffenceTitlePriority(
    currentOffenceCodeLookup,
    pnldOffenceCodeLookup,
    cjsOffenceCodeLookup,
    pncOffenceCodeLookup
  )

  const recordableOnPnc = new RecordableOnPncPriority(
    currentOffenceCodeLookup,
    pnldOffenceCodeLookup,
    pncOffenceCodeLookup
  )

  const merger = new OffenceCodeMerger(
    allOffenceCodeKeys,
    hoClassification,
    notifiableToHo,
    offenceCategory,
    offenceTitle,
    recordableOnPnc
  )
  const mergedData = merger.merge()
  const sortedData = consistentSort(mergedData)
  await fs.writeFile("output-data/data/offence-code.json", JSON.stringify(sortedData, null, 2))
}

main()
  .then(() => console.log("Offence code data merged"))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
