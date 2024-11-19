import { default as rawSchemaRelations } from "./schemaRelations"

const schemaRelations = rawSchemaRelations as Record<string, string[]>
type AhoKey = ({} & string) | keyof typeof rawSchemaRelations

class Describer {
  static getText = (description: string) => ({
    $description: description
  })

  private _content: string

  private _example: string

  private _path: AhoKey

  private _value: string[] = []

  private generateLinkQuery = (path: string) =>
    path
      .split(">")
      .map((p) => p.trim())
      .join("_")

  content = (...contentParam: string[]) => {
    this._content = contentParam.join("\n")
    return this
  }

  example = (exampleParam: string) => {
    this._example = exampleParam
    return this
  }

  get = () => {
    let description = this._content ? `<div><p>${this._content}</p></div>` : ""

    if (this._value.length > 0) {
      description += "<h5>Value</h5>"
      if (this._value.length > 1) {
        description += `<p><ul>${this._value.map((v) => `<li>${v}</li>`).join("")}</ul></p>`
      } else {
        description += `<p>${this._value[0]}</p>`
      }
    }

    const relations = schemaRelations[this._path]

    if (relations && relations.length > 0) {
      const spiRelations = relations.filter((x) => x.startsWith("DeliverRequest"))
      const ahoRelations = relations.filter((x) => !x.startsWith("DeliverRequest"))

      description += "<h5>Relations</h5>"
      if (spiRelations.length > 0) {
        description += `<p><ul>${spiRelations
          .map(
            (f) =>
              `<li><strong>SPI: </strong><a href="../spi/index.html#${this.generateLinkQuery(
                f
              )}" target="_blank">${f}</a></li>`
          )
          .join("")}</ul></p>`
      }

      if (ahoRelations.length > 0) {
        description += `<p><ul>${ahoRelations
          .map(
            (f) =>
              `<li><strong>AHO: </strong><a href="index.html#${this.generateLinkQuery(
                f
              )}" target="_blank">${f}</a></li>`
          )
          .join("")}</ul></p>`
      }
    }

    const fieldsDependOnThisField = Object.keys(schemaRelations).filter((key) =>
      schemaRelations[key].includes(this._path)
    )

    if (fieldsDependOnThisField.length > 0) {
      const spiFields = fieldsDependOnThisField.filter((x) => x.startsWith("DeliverRequest"))
      const ahoFields = fieldsDependOnThisField.filter((x) => !x.startsWith("DeliverRequest"))

      description += "<h5>Fields that rely on this field</h5>"
      if (spiFields.length > 0) {
        description += `<p><ul>${spiFields
          .map(
            (f) =>
              `<li><strong>SPI: </strong><a href="../spi/index.html#${this.generateLinkQuery(
                f
              )}" target="_blank">${f}</a></li>`
          )
          .join("")}</ul></p>`
      }

      if (ahoFields.length > 0) {
        description += `<p><ul>${ahoFields
          .map(
            (f) =>
              `<li><strong>AHO: </strong><a href="index.html#${this.generateLinkQuery(
                f
              )}" target="_blank">${f}</a></li>`
          )
          .join("")}</ul></p>`
      }
    }

    if (this._example) {
      description += `<h5>Example</h5><p>${this._example}</p>`
    }

    return { $description: description }
  }

  path = (pathParam: AhoKey) => {
    this._path = pathParam
    return this
  }

  value = (...valueParam: string[]) => {
    this._value = valueParam
    return this
  }

  static get $() {
    return new Describer()
  }
}

export const organisationUnitDescription = {
  BottomLevelCode: Describer.$.value("Sixth and seventh letters of the Organisation Unit Code")
    .example("B03AX<span style='font-weight: 600; color: red'>00</span>")
    .get(),
  OrganisationUnitCode: Describer.$.value("`TopLevelCode` + `SecondLevelCode` + `ThirdLevelCode` + `BottomLevelCode`")
    .example("B03AX00")
    .get(),
  SecondLevelCode: Describer.$.value("Second and third letters of the Organisation Unit Code")
    .example("B<span style='font-weight: 600; color: red'>03</span>AX00")
    .get(),
  ThirdLevelCode: Describer.$.value("Fourth and fifth letters of the Organisation Unit Code")
    .example("B03<span style='font-weight: 600; color: red'>AX</span>00")
    .get(),
  TopLevelCode: Describer.$.value("First letter of the Organisation Unit Code")
    .example("<span style='font-weight: 600; color: red'>B</span>03AX00")
    .get()
}

export const resultDescription = {
  AmountSpecifiedInResult: {
    ...Describer.$.path(
      "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > AmountSpecifiedInResult"
    )
      .content("Present if `ResultAmountSterling` has value")
      .get(),
    Amount: Describer.$.path(
      "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > AmountSpecifiedInResult > Amount"
    ).get(),
    DecimalPlaces: Describer.$.path(
      "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > AmountSpecifiedInResult > DecimalPlaces"
    ).get(),
    Type: Describer.$.path(
      "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > AmountSpecifiedInResult > Type"
    )
      .value("Look up amount type by AHO's `CJSresultCode`")
      .get()
  },
  BailCondition: Describer.$.path(
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > BailCondition"
  )
    .content("Populated during the court case enrichment.")
    .value(
      "Value is `ResultQualifierVariable`s' descriptions when `ResultQualifierVariable` is between `JD` and `JZ` inclusively, then look up the `ResultQualifierVariable` description"
    )
    .get(),
  CJSresultCode: Describer.$.path(
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > CJSresultCode"
  )
    .value("`ResultCode` or `1000` (Free text result code)")
    .get(),
  ConvictingCourt: Describer.$.path(
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > ConvictingCourt"
  ).get(),
  CourtType: Describer.$.path("AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > CourtType")
    .content(
      "Populated during the enrichment.",
      "Court name mentioned in value section is **top level name** + **second level name** + **third level name** + **bottom level name** of `SourceOrganisation`"
    )
    .value(
      "`MCY` (Magistrates Court for Youth) when `SourceOrganisation.TopLevelCode` is `B` (Magistrates Court) and court name contains word `YOUTH`",
      "`MCA` (Magistrates Court for Adult) when `SourceOrganisation.TopLevelCode` is `B` (Magistrates Court) and court name does not contain word `YOUTH`",
      "Otherwise `CC` (Crown Court)"
    )
    .get(),
  DateSpecifiedInResult: {
    Date: Describer.$.path(
      "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > DateSpecifiedInResult > Date"
    ).get(),
    Sequence: Describer.$.value("`1` if `DurationStartDate` and `2` if `DurationEndDate`").get()
  },
  Duration: {
    ...Describer.$.content(
      "There can be maximum of 2 durations if both duration and secondary duration have value in SPI Result"
    )
      .path("AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > Duration")
      .get(),
    DurationLength: Describer.$.path(
      "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > Duration > DurationLength"
    ),
    DurationType: Describer.$.path(
      "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > Duration > DurationType"
    )
      .value(
        "Always set to `Duration`",
        "If this is being set for the secondary duration, the value can be `Suspended` if `CJSresultCode` is either `1115` or `1134`"
      )
      .get(),
    DurationUnit: Describer.$.path(
      "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > Duration > DurationUnit"
    )
      .value(
        "`DurationUnit` or `S` (Session) if `DurationUnit` is empty or the value is `.`",
        "Also `SecondaryDurationUnit` or `S` (Session) if `SecondaryDurationUnit` is empty or the value is `.`"
      )
      .get()
  },
  ModeOfTrialReason: Describer.$.path(
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > ModeOfTrialReason"
  )
    .value("Maps SPI code to CJS code", "SPI code if CJS code not found")
    .get(),
  NextCourtType: Describer.$.path(
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > NextCourtType"
  )
    .content(
      "Populated during the enrichment.",
      "Court name mentioned in value section is **top level name** + **second level name** + **third level name** + **bottom level name** of `SourceOrganisation`"
    )
    .value(
      "No value when `NextResultSourceOrganisation` and `NextHearingDate` have no value",
      "`MCY` (Magistrates Court for Youth) when `NextResultSourceOrganisation.TopLevelCode` is `B` (Magistrates Court) and court name contains word `YOUTH`",
      "`MCA` (Magistrates Court for Adult) when `NextResultSourceOrganisation.TopLevelCode` is `B` (Magistrates Court) and court name does not contain word `YOUTH`",
      "Otherwise `CC` (Crown Court)"
    )
    .get(),
  NextHearingDate: Describer.$.path(
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > NextHearingDate"
  )
    .value("`DateOfHearing` if has value", "The date extracted from the `ResultVariableText`")
    .get(),
  NextHearingTime: Describer.$.path(
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > NextHearingTime"
  ).get(),
  NextResultSourceOrganisation: Describer.$.path(
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > NextResultSourceOrganisation"
  )
    .value(
      "Look up organisation unit code by `CourtHearingLocation`",
      "Extract the court name from the `ResultVariableText` and look up the orginsation unit by the court name"
    )
    .get(),
  NumberOfOffencesTIC: Describer.$.path(
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > NumberOfOffencesTIC"
  )
    .value("TIC regex pattern as found in the `ResultText`")
    .get(),
  NumberSpecifiedInResult: {
    Number: Describer.$.path(
      "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > NumberSpecifiedInResult > Number"
    )
      .value(
        "`PenaltyPoints` if `ResultCode` is `3008`",
        "`SecondaryDurationValue` if `ResultCode` is `1052` or `3105` (Curfew), and `SecondaryDurationUnit` is `H` (Hours)"
      )
      .get(),
    Type: Describer.$.value("Always set to `P`").get()
  },
  OffenceRemandStatus: Describer.$.path(
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > OffenceRemandStatus"
  )
    .value("Maps SPI code to CJS code", "SPI code if CJS code not found")
    .get(),
  PleaStatus: Describer.$.path(
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > PleaStatus"
  )
    .value("Maps SPI code to CJS code", "SPI code if CJS code not found")
    .get(),
  PNCDisposalType: Describer.$.content(
    "Populated when case is recordable (either `PncQuery` has value or there is `Offence.RecordableOnPNCindicator` with value `true`)"
  ).value(
    [
      "`3117` (Victim surcharge) if",
      "- `CourtType` starts with `M`, and",
      "- `CRESTDisposalCode` is in victim surcharges CREST codes (`COM`, `COMINST`, `COMTIME`, `FD`, `FDINST`, `FDTIME`, `FINE`, `PC`, `PCINST`, or `PCTIME`), and",
      "- `ResultVariableText` contains string `victim surcharge`, and",
      "- there is a `AmountSpecifiedInResult.Amount` with value `15`"
    ].join("\n"),
    "`2060` (Guilty of Alternative) if `Verdict` is `NA` (Guilty of Alternative)",
    "PNC adjudication code by looking up the PNC disposal by `CJSresultCode` when `ResultClass` is `Adjournment with Judgement` or `Judgement with final result`",
    "PNC non-adjudication code by looking up the PNC disposal by `CJSresultCode` when `ResultClass` is NOT `Adjournment with Judgement` or `Judgement with final result`",
    "Otherswie, `CJSresultCode` will be used"
  ),
  ReasonForOffenceBailConditions: Describer.$.path(
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > ReasonForOffenceBailConditions"
  ).get(),
  ResultClass: Describer.$.content(
    "Populated when case is recordable (either `PncQuery` has value or there is `Offence.RecordableOnPNCindicator` with value `true`)",
    "Adjournment condition meets if either `NextResultSourceOrganisation` has value or result code is adjourned (check `isAdjourned` function for list of CJS result codes) or warrant is issued (CJSresultcode between `4575` and `4577` inclusive) or result is adjourned with no next hearing (`CJSresultCode` is `0`)"
  )
    .value(
      "`Adjournment post Judgement` if `ConvictionDate` is before `DateOfHearing` and adjournment condition met",
      "`Sentence` if `ConvictionDate` is before `DateOfHearing` and adjournment condition did not meet",
      "`Adjournment with Judgement` if `ConvictionDate` is the same as `DateOfHearing` and adjournment condition met",
      "`Judgement with final result` if `ConvictionDate` is the same as `DateOfHearing` and adjournment condition did not meet",
      "`Judgement with final result` if `PleaStatus` contains string `ADM` and adjournment condition did not meet",
      "`Unresulted` if `CJSresultCode` is one of the result class codes (check `isResultClassCode` function) or `Verdict` is guilty (`NG`, `NC`, or `NA`), and adjournment condition met",
      "`Judgement with final result` if `CJSresultCode` is one of the result class codes (check `isResultClassCode` function) or `Verdict` is guilty (`NG`, `NC`, or `NA`), and adjournment condition did not meet",
      "`Adjournment pre Judgement` if `Verdict` is empty and adjournment condition met"
    )
    .get(),
  ResultHalfLifeHours: Describer.$.path(
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > ResultHalfLifeHours"
  )
    .value("Look up the result code config by `CJSresultCode`, then get result half life hours value")
    .get(),
  ResultHearingDate: Describer.$.value("`ConvictionDate` if has value, otherwise `DateOfHearing`")
    .path("AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > ResultHearingDate")
    .get(),
  ResultHearingType: Describer.$.value("Always set to `OTHER`").get(),
  ResultQualifierVariable: {
    Code: Describer.$.path(
      "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > ResultQualifierVariable > Code"
    )
      .value(
        "`ResultCodeQualifier`",
        "`BA` is also added when `CJSresultCode` is `3105` (Tagging fix add code), and there is a `Result` with a `ResultCodeQualifier` containing `BA` string and `CJSresultCode` being either `1115`, `1116`, `1141`, `1142`, or `1143` (Tagging fix remove)"
      )
      .get()
  },
  ResultVariableText: Describer.$.path(
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > ResultVariableText"
  ).get(),
  SourceOrganisation: Describer.$.path(
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > SourceOrganisation"
  ).get(),
  Urgent: {
    ...Describer.$.path("AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > Urgent")
      .content(
        "Present if `ResultHalfLifeHours` is less than urgency threshold (48 hours). When this block present, value of `urgency` is `ResultHalfLifeHours` and value of `urgent` is `true`"
      )
      .get()
  },
  Verdict: Describer.$.path("AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > Verdict")
    .value("Maps SPI code to CJS code", "SPI code if CJS code not found")
    .get(),
  WarrantIssueDate: Describer.$.path(
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > WarrantIssueDate"
  )
    .value("`DateOfHearing` if `CJSresultCode` is `4505`, `4575`, `4576`, `4577`, `4585`, or `4586`")
    .get()
}

export const offenceDescription = {
  ...Describer.$.path("AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence").get(),
  ActualOffenceDateCode: Describer.$.path(
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > ActualOffenceDateCode"
  ).get(),
  ActualOffenceEndDate: {
    ...Describer.$.path(
      "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > ActualOffenceEndDate"
    )
      .value("Only if `OffenceTiming.OffenceEnd` has value")
      .get(),
    EndDate: Describer.$.path(
      "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > ActualOffenceEndDate > EndDate"
    ).get()
  },
  ActualOffenceStartDate: {
    StartDate: Describer.$.path(
      "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > ActualOffenceStartDate > StartDate"
    ).get()
  },
  ActualOffenceWording: Describer.$.path(
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > ActualOffenceWording"
  ).get(),
  AlcoholLevel: {
    ...Describer.$.path(
      "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > AlcoholLevel"
    ).get(),
    Amount: Describer.$.path(
      "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > AlcoholLevel > Amount"
    ).get(),
    Method: Describer.$.path(
      "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > AlcoholLevel > Method"
    )
      .value("Maps SPI code to CJS code", "SPI code if CJS code not found")
      .get()
  },
  ArrestDate: Describer.$.path(
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > ArrestDate"
  ).get(),
  ChargeDate: Describer.$.path(
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > ChargeDate"
  ).get(),
  CommittedOnBail: Describer.$.value("Always set to `D` (Don't know)").get(),
  ConvictionDate: Describer.$.path(
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > ConvictionDate"
  )
    .value(
      "`ConvictionDate` if has value",
      "`DateOfHearing` if adjournment sine die condition met (Condition: There is at least a `ResultCode` with value `2007` in the offence and all `ResultCode`s in the offence have value and none of them are in the stop list)"
    )
    .get(),
  CourtOffenceSequenceNumber: Describer.$.path(
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CourtOffenceSequenceNumber"
  ).get(),
  CriminalProsecutionReference: {
    DefendantOrOffender: {
      CheckDigit: Describer.$.path(
        "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CriminalProsecutionReference > DefendantOrOffender > CheckDigit"
      )
        .value("Extracted from `ArrestSummonsNumber`")
        .get(),
      DefendantOrOffenderSequenceNumber: Describer.$.path(
        "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CriminalProsecutionReference > DefendantOrOffender > DefendantOrOffenderSequenceNumber"
      )
        .value("Extracted from `ArrestSummonsNumber`")
        .get(),
      OrganisationUnitIdentifierCode: Describer.$.path(
        "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CriminalProsecutionReference > DefendantOrOffender > OrganisationUnitIdentifierCode"
      )
        .value("All codes are extracted from `ArrestSummonsNumber`")
        .get(),
      Year: Describer.$.path(
        "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CriminalProsecutionReference > DefendantOrOffender > Year"
      )
        .value("Extracted from `ArrestSummonsNumber`")
        .get()
    },
    OffenceReason: {
      OffenceCode: {
        ...Describer.$.path(
          "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CriminalProsecutionReference > OffenceReason > OffenceCode"
        ).get(),
        ActOrSource: Describer.$.path(
          "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CriminalProsecutionReference > OffenceReason > OffenceCode > ActOrSource"
        )
          .value("1st and 2nd characters of the `OffenceCode` when `OffenceCode` does not start with `COML` and `XX00`")
          .get(),
        CommonLawOffence: Describer.$.path(
          "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CriminalProsecutionReference > OffenceReason > OffenceCode > CommonLawOffence"
        )
          .value("Value is set to `COML` if `OffenceCode` starts with `COML`")
          .get(),
        FullCode: Describer.$.path(
          "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CriminalProsecutionReference > OffenceReason > OffenceCode > FullCode"
        ).get(),
        Indictment: Describer.$.path(
          "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CriminalProsecutionReference > OffenceReason > OffenceCode > Indictment"
        )
          .value("Value is set to `XX00` if `OffenceCode` starts with `XX00`")
          .get(),
        Qualifier: Describer.$.path(
          "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CriminalProsecutionReference > OffenceReason > OffenceCode > Qualifier"
        )
          .value("`OffenceCode` segment starting from the 11th character to the end of the string")
          .get(),
        Reason: Describer.$.path(
          "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CriminalProsecutionReference > OffenceReason > OffenceCode > Reason"
        )
          .value("`OffenceCode` segment starting from the 4th character up to the 11th character")
          .get(),
        Year: Describer.$.path(
          "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CriminalProsecutionReference > OffenceReason > OffenceCode > Year"
        )
          .value("3rd and 4th characters of the `OffenceCode` when `OffenceCode` does not start with `COML` and `XX00`")
          .get()
      }
    }
  },
  HomeOfficeClassification: Describer.$.path(
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > HomeOfficeClassification"
  )
    .value("Look up the offence code and get the HomeOfficeClassification")
    .get(),
  LocationOfOffence: Describer.$.path(
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > LocationOfOffence"
  ).get(),
  NotifiableToHOindicator: Describer.$.path(
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > NotifiableToHOindicator"
  )
    .value("Look up the offence code and get the NotifiableToHOindicator")
    .get(),
  OffenceCategory: Describer.$.path(
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > OffenceCategory"
  )
    .value(
      "`B7` if offence code is `05MC001` (Ignored) (offence code is either `OffenceCode.FullCode` or `LocalOffenceCode.OffenceCode`",
      "Look up the offence code category if offence code is not `05MC001` (Ignored)"
    )
    .get(),
  OffenceEndDate: Describer.$.path(
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > OffenceEndDate"
  ).get(),
  OffenceTime: Describer.$.path(
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > OffenceTime"
  )
    .value("It's set to `OffenceStartTime` when `OffenceDateCode` value is not 4 (Between)")
    .get(),
  OffenceTitle: Describer.$.path(
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > OffenceTitle"
  )
    .value("Look up the offence code and get the OffenceTitle")
    .get(),
  RecordableOnPNCindicator: Describer.$.path(
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > RecordableOnPNCindicator"
  )
    .value(
      "`false` if offence code is `05MC001` (Ignored) (offence code is either `OffenceCode.FullCode` or `LocalOffenceCode.OffenceCode`",
      "Look up the offence code recordability on PNC if offence code is not `05MC001` (Ignored)"
    )
    .get(),
  ResultHalfLifeHours: Describer.$.path(
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > ResultHalfLifeHours"
  )
    .value("Look up the offence code and get the ResultHalfLifeHours")
    .get(),
  StartTime: Describer.$.path(
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > StartTime"
  )
    .value("It's set to `OffenceStartTime` when `OffenceDateCode` value is 4 (Between)")
    .get()
}

const hearingDescription = {
  ...Describer.$.path("AnnotatedHearingOutcome > HearingOutcome > Hearing").get(),
  CourtHearingLocation: Describer.$.path(
    "AnnotatedHearingOutcome > HearingOutcome > Hearing > CourtHearingLocation"
  ).get(),
  CourtHouseCode: Describer.$.path("AnnotatedHearingOutcome > HearingOutcome > Hearing > CourtHouseCode").get(),
  CourtHouseName: Describer.$.path("AnnotatedHearingOutcome > HearingOutcome > Hearing > CourtHouseName")
    .value(
      "Look up organisation unit by `CourtHearingLocation`, then concatenate `TopLevelName` + `SecondLevelName` + `ThirdLevelName` + `BottomLevelName`"
    )
    .get(),
  CourtType: Describer.$.path("AnnotatedHearingOutcome > HearingOutcome > Hearing > CourtType")
    .value(
      "`MCY` (Magistrates Court for Youth) when organisation unit `TopLevelCode` is `B` (Magistrates Court) and `CourtHouseName` contains word `YOUTH`",
      "`MCA` (Magistrates Court for Adult) when organisation unit `TopLevelCode` is `B` (Magistrates Court) and `CourtHouseName` does not contain word `YOUTH`",
      "Otherwise `CC` (Crown Court)"
    )
    .get(),
  DateOfHearing: Describer.$.path("AnnotatedHearingOutcome > HearingOutcome > Hearing > DateOfHearing").get(),
  DefendantPresentAtHearing: Describer.$.path(
    "AnnotatedHearingOutcome > HearingOutcome > Hearing > DefendantPresentAtHearing"
  )
    .value(
      "Whichever has value in SPI Result: `CourtIndividualDefendant.PresentAtHearing` or `CourtCorporateDefendant.PresentAtHearing`"
    )
    .get(),
  HearingDocumentationLanguage: Describer.getText("Always `D`"),
  HearingLanguage: Describer.getText("Always `D`"),
  SourceReference: Describer.$.path("AnnotatedHearingOutcome > HearingOutcome > Hearing > SourceReference")
    .value(
      "`DocumentName` is populated from `CourtIndividualDefendant` or `CourtCorporateDefendant` in SPI Result",
      "`DocumentType` value is `SPI Case Result`",
      "`UniqueID` value is `DeliverRequest.MessageIdentifier` in SPI Result"
    )
    .get(),
  TimeOfHearing: Describer.$.path("AnnotatedHearingOutcome > HearingOutcome > Hearing > TimeOfHearing").get()
}

const caseDescription = {
  ...Describer.$.path("AnnotatedHearingOutcome > HearingOutcome > Case").get(),
  CourtReference: {
    ...Describer.getText("Only `MagistratesCourtReference` is used. Crown Court is not supported."),
    MagistratesCourtReference: Describer.$.path(
      "AnnotatedHearingOutcome > HearingOutcome > Case > CourtReference > MagistratesCourtReference"
    )
      .value("SPI Result's `PTIURN`", "During enrichment, if the value is `TRUNCATED` it is set to AHO's `PTIURN`")
      .get()
  },
  ForceOwner: Describer.$.path("AnnotatedHearingOutcome > HearingOutcome > Case > ForceOwner")
    .value(
      "No value when `ManualForceOwner` has value, or",
      "`PncQuery.forceStationCode`, or",
      "`Case.PTIURN` when it's not a dummy PTIURN, or",
      "`HearingDefendant.ArrestSummonsNumber` when it's not a dummy ASN, or",
      "`CourtHearingLocation.SecondLevelCode`"
    )
    .get(),
  HearingDefendant: {
    Address: {
      ...Describer.$.path("AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Address").get(),
      AddressLine1: Describer.$.value(
        "`SimpleAddress.AddressLine1` if has value",
        "`ComplexAddress.UniqueStreetReferenceNumber` or `ComplexAddress.StreetDescription` or `ComplexAddress.Locality` or `ComplexAddress.Town` or `ComplexAddress.AdministrativeArea`"
      ).get(),
      AddressLine2: Describer.$.value(
        "`SimpleAddress.AddressLine2` if has value",
        "`ComplexAddress.StreetDescription` or `ComplexAddress.Locality` or `ComplexAddress.Town` or `ComplexAddress.AdministrativeArea`"
      ).get(),
      AddressLine3: Describer.$.value(
        "`SimpleAddress.AddressLine3` if has value",
        "`ComplexAddress.Locality` or `ComplexAddress.Town` or `ComplexAddress.AdministrativeArea`"
      ).get(),
      AddressLine4: Describer.$.value(
        "`SimpleAddress.AddressLine4` if has value",
        "`ComplexAddress.Town` or `ComplexAddress.AdministrativeArea`"
      ).get(),
      AddressLine5: Describer.$.value(
        "`SimpleAddress.AddressLine5` if has value",
        "`ComplexAddress.AdministrativeArea`"
      ).get()
    },
    ArrestSummonsNumber: Describer.$.value(
      "Value of `ProsecutorReference` will be converted to long ASN format when enriching the court case"
    )
      .path("AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > ArrestSummonsNumber")
      .get(),
    BailConditions: Describer.$.path(
      "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > BailConditions"
    )
      .value(
        "`BailConditions` if has value",
        "Also `With Electronic Tagging` value is added when\n- `BailConditions` is not empty\n- `BA` result qualifier code is generated. `BA` is generated when `CJSresultCode` in one of the `Result`s is `3105` (Tagging fix add code), and there is a `Result` with a `ResultCodeQualifier` containing `BA` string and `CJSresultCode` being either `1115`, `1116`, `1141`, `1142`, or `1143` (Tagging fix remove)"
      )
      .get(),
    CourtPNCIdentifier: Describer.$.path(
      "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > CourtPNCIdentifier"
    ).get(),
    DefendantDetail: {
      BirthDate: Describer.$.path(
        "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > DefendantDetail > BirthDate"
      ).get(),
      Gender: Describer.$.path(
        "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > DefendantDetail > Gender"
      ).get(),
      GeneratedPNCFilename: Describer.$.path(
        "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > DefendantDetail > GeneratedPNCFilename"
      )
        .value("Join `FamilyName` and all `GivenName`s with `/`")
        .get(),
      PersonName: {
        ...Describer.$.path(
          "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > DefendantDetail > PersonName"
        ).get(),
        FamilyName: Describer.$.path(
          "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > DefendantDetail > PersonName > FamilyName"
        ).get(),
        GivenName: Describer.$.path(
          "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > DefendantDetail > PersonName > GivenName"
        )
          .value("`PersonGivenName1` + `PersonGivenName2` + `PersonGivenName3`")
          .get(),
        Title: Describer.$.path(
          "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > DefendantDetail > PersonName > Title"
        ).get()
      }
    },
    OrganisationName: Describer.$.path(
      "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > OrganisationName"
    ).get(),
    ReasonForBailConditions: Describer.$.path(
      "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > ReasonForBailConditions"
    ).get(),
    RemandStatus: Describer.$.path("AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > RemandStatus")
      .value("Maps SPI code to CJS code", "SPI code if CJS code not found")
      .get()
  },
  PreChargeDecisionIndicator: Describer.getText("Always `false`"),
  PTIURN: Describer.$.path("AnnotatedHearingOutcome > HearingOutcome > Case > PTIURN")
    .value("SPI Result's `PTIURN`")
    .get(),
  RecordableOnPNCindicator: Describer.$.path(
    "AnnotatedHearingOutcome > HearingOutcome > Case > RecordableOnPNCindicator"
  )
    .value("`true` if any of the offences are recordable on PNC or `PncQuery` has value")
    .get(),
  Urgent: {
    ...Describer.$.path("AnnotatedHearingOutcome > HearingOutcome > Case > Urgent")
      .content(
        "Present if any of the `Result[].Urgent.urgency` is less than half like urgent threshold (48 hours).\nValue of `urgency` in this block is the minimum `Result[].Urgent.urgency`\nValue of `urgent` is `true` when this block present"
      )
      .get()
  }
}

export const ahoDescription = {
  AnnotatedHearingOutcome: {
    HearingOutcome: {
      Case: caseDescription,
      Hearing: hearingDescription
    },
    PncErrorMessage: Describer.$.content("Present if PNC gateway throws exception")
      .value("Error message returned from PNC gateway")
      .get(),
    PncQuery: {
      ...Describer.$.content(
        "Present if ASN is not dummy and is valid, and there are not more than 100 offences in the case"
      )
        .value("PNC query result")
        .get(),
      forceStationCode: Describer.$.path("PncQuery > forceStationCode").get()
    },
    PncQueryDate: Describer.$.content(
      "Present if ASN is not dummy and is valid, and there are not more than 100 offences in the case"
    )
      .value("PNC query's date and time")
      .get()
  }
}
