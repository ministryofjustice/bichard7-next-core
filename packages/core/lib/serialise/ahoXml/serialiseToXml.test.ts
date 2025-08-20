import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import { parseAhoXml } from "@moj-bichard7/common/aho/parseAhoXml/index"
import fs from "fs"
import MockDate from "mockdate"
import path from "path"

import serialiseToXml from "./serialiseToXml"

const getAho = (filePath: string): AnnotatedHearingOutcome => {
  const inputAho = fs.readFileSync(path.resolve(__dirname, `../../../${filePath}`), "utf8")
  return parseAhoXml(inputAho) as AnnotatedHearingOutcome
}

describe("serialiseToXml", () => {
  beforeEach(() => {
    MockDate.set(new Date("2022-06-06").getTime())
  })

  afterEach(() => {
    MockDate.reset()
  })

  it("should generate AHO XML with validations from an AHO object", () => {
    const hearingOutcome = getAho("phase1/tests/fixtures/AnnotatedHO1-with-exceptions.xml")
    const ahoXml = serialiseToXml(hearingOutcome)

    expect(ahoXml).toMatchSnapshot()
  })

  it("should generate AHO XML without validations from an AHO object", () => {
    const hearingOutcome = getAho("phase1/tests/fixtures/AnnotatedHO1-with-exceptions.xml")
    const ahoXml = serialiseToXml(hearingOutcome, false)

    expect(ahoXml).toMatchSnapshot()
  })

  it("should generate AHO XML with PNC error messages", () => {
    const hearingOutcome = getAho("phase1/tests/fixtures/AnnotatedHO1-with-pnc-errors.xml")
    const ahoXml = serialiseToXml(hearingOutcome)

    expect(ahoXml).toMatchSnapshot()
  })
})
