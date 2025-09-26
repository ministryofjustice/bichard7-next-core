import { addCjsmSuffix, removeCjsmSuffix } from "lib/cjsmSuffix"

describe("addCjsmSuffix()", () => {
  it("should append .cjsm.net to an email address if it doesn't already end in .cjsm.net", () => {
    expect(addCjsmSuffix("bichard01@example.com")).toEqual("bichard01@example.com.cjsm.net")
    expect(addCjsmSuffix("SUPERVISOR@PNN.POLICE.UK")).toEqual("supervisor@pnn.police.uk.cjsm.net")
  })

  it("should not append .cjsm.net to an email address if it already ends in .cjsm.net", () => {
    expect(addCjsmSuffix("bichard01@example.com.cjsm.net")).toEqual("bichard01@example.com.cjsm.net")
    expect(addCjsmSuffix("SUPERVISOR@PNN.POLICE.UK.CJSM.NET")).toEqual("supervisor@pnn.police.uk.cjsm.net")
    expect(addCjsmSuffix("test.user@madetech.cjsm.net")).toEqual("test.user@madetech.cjsm.net")
  })

  it("should replace the domain with a CJSM domain if it matches an exception", () => {
    expect(addCjsmSuffix("test.user@madetech.com")).toEqual("test.user@madetech.cjsm.net")
    expect(addCjsmSuffix("FOO.BAR@MADETECH.COM")).toEqual("foo.bar@madetech.cjsm.net")
  })
})

describe("removeCjsmSuffix()", () => {
  it("should remove .cjsm.net suffix from an email address if it ends in .cjsm.net", () => {
    expect(removeCjsmSuffix("bichard01@example.com.cjsm.net")).toEqual("bichard01@example.com")
    expect(removeCjsmSuffix("SUPERVISOR@PNN.POLICE.UK.CJSM.NET")).toEqual("supervisor@pnn.police.uk")
  })

  it("should not alter email address if it does not end in .cjsm.net", () => {
    expect(removeCjsmSuffix("bichard01@example.com")).toEqual("bichard01@example.com")
    expect(removeCjsmSuffix("SUPERVISOR@PNN.POLICE.UK")).toEqual("supervisor@pnn.police.uk")
    expect(removeCjsmSuffix("test.user@madetech.com")).toEqual("test.user@madetech.com")
  })

  it("should replace the CJSM domain with a regular one if it matches an exception", () => {
    expect(removeCjsmSuffix("test.user@madetech.cjsm.net")).toEqual("test.user@madetech.com")
    expect(removeCjsmSuffix("FOO.BAR@MADETECH.CJSM.NET")).toEqual("foo.bar@madetech.com")
  })
})
