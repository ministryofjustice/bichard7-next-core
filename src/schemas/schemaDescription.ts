class Describer {
  private _value: string[] = []

  private _example: string

  private _spiResult: string[] = []

  private _aho: string[] = []

  private generateLinkQuery = (path: string) =>
    path
      .split(">")
      .map((p) => p.trim())
      .join("_")

  static get $() {
    return new Describer()
  }

  static getText = (description: string) => ({
    $description: description
  })

  value = (...valueParam: string[]) => {
    this._value = valueParam
    return this
  }

  example = (exampleParam: string) => {
    this._example = exampleParam
    return this
  }

  spi = (...spiParam: string[]) => {
    this._spiResult = spiParam
    return this
  }

  aho = (...ahoParam: string[]) => {
    this._aho = ahoParam
    return this
  }

  get = () => {
    let description = ""
    if (this._value.length > 0) {
      description += "<h5>Value</h5>"
      if (this._value.length > 1) {
        description += `<p><ul>${this._value.map((v) => `<li>${v}</li>`).join("")}</ul></p>`
      } else {
        description += `<p>${this._value[0]}</p>`
      }
    }

    if (this._spiResult.length > 0 || this._aho.length > 0) {
      description += "<h5>Related fields</h5>"
      if (this._spiResult.length > 0) {
        description += `<p>SPI Result</p><p><ul>${this._spiResult
          .map((f) => `<li><a href="spi.schema.html#${this.generateLinkQuery(f)}" target="_blank">${f}</a></li>`)
          .join("")}</ul></p>`
      }

      if (this._aho.length > 0) {
        description += `<p>AHO</p><p><ul>${this._aho
          .map((f) => `<li><a href="aho.schema.html#${this.generateLinkQuery(f)}" target="_blank">${f}</a></li>`)
          .join("")}</ul></p>`
      }
    }

    if (this._example) {
      description += `<h5>Example</h5><p>${this._example}</p>`
    }

    return { $description: description }
  }
}

export const organisationUnitDescription = {
  TopLevelCode: Describer.$.value("First letter of the Organisation Unit Code")
    .example("<span style='font-weight: 600; color: red'>B</span>03AX00")
    .get(),
  SecondLevelCode: Describer.$.value("Second and third letters of the Organisation Unit Code")
    .example("B<span style='font-weight: 600; color: red'>03</span>AX00")
    .get(),
  ThirdLevelCode: Describer.$.value("Fourth and fifth letters of the Organisation Unit Code")
    .example("B03<span style='font-weight: 600; color: red'>AX</span>00")
    .get(),
  BottomLevelCode: Describer.$.value("Sixth and seventh letters of the Organisation Unit Code")
    .example("B03AX<span style='font-weight: 600; color: red'>00</span>")
    .get(),
  OrganisationUnitCode: Describer.$.value("`TopLevelCode` + `SecondLevelCode` + `ThirdLevelCode` + `BottomLevelCode`")
    .example("B03AX00")
    .get()
}

export const resultDescription = {
  CJSresultCode: Describer.$.value("`ResultCode` or `1000` (Free text result code)")
    .spi("DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > ResultCode")
    .get(),
  OffenceRemandStatus: Describer.$.value("Maps SPI code to CJS code", "SPI code if CJS code not found")
    .spi(
      "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > NextHearing > BailStatusOffence"
    )
    .get(),
  SourceOrganisation: Describer.$.spi(
    "DeliverRequest > Message > ResultedCaseMessage > Session > CourtHearing > Hearing > CourtHearingLocation"
  ).get(),
  ConvictingCourt: Describer.$.spi(
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > ConvictingCourt"
  ).get(),
  ResultHearingType: Describer.$.value("Always set to `OTHER`").get(),
  ResultHearingDate: Describer.$.spi(
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > ConvictionDate"
  ).get(),
  ReasonForOffenceBailConditions: Describer.$.spi(
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > ReasonForBailConditionsOrCustody"
  ).get(),
  NextHearingDate: Describer.$.value("`DateOfHearing` if has value", "The date extracted from the `ResultVariableText`")
    .spi(
      "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > NextHearing > NextHearingDetails > DateOfHearing"
    )
    .aho(
      "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > CJSresultCode",
      "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > ResultVariableText"
    )
    .get(),
  NextHearingTime: Describer.$.spi(
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > NextHearing > NextHearingDetails > TimeOfHearing"
  ).get(),
  NextResultSourceOrganisation: Describer.$.value(
    "Look up organisation unit code by `CourtHearingLocation`",
    "Extract the court name from the `ResultVariableText` and look up the orginsation unit by the court name"
  )
    .spi(
      "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > NextHearing > NextHearingDetails > CourtHearingLocation"
    )
    .aho(
      "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > CJSresultCode",
      "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > ResultVariableText"
    )
    .get(),
  Duration: {
    ...Describer.$.spi(
      "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > Outcome > Duration"
    ).get(),
    DurationType: Describer.$.value("Always set to `Duration`").get(),
    DurationUnit: Describer.$.value(
      "`DurationUnit` or `S` (Session) if `DurationUnit` is empty or the value is `.`",
      "Also `SecondaryDurationUnit` or `S` (Session) if `SecondaryDurationUnit` is empty or the value is `.`"
    )
      .spi(
        "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > Outcome > Duration > DurationUnit",
        "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > Outcome > Duration > SecondaryDurationUnit"
      )
      .get(),
    DurationLength: Describer.$.spi(
      "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > Outcome > Duration > DurationValue",
      "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > Outcome > Duration > SecondaryDurationValue"
    )
  },
  DateSpecifiedInResult: {
    Date: Describer.$.spi(
      "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > Outcome > Duration > DurationStartDate",
      "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > Outcome > Duration > DurationEndDate"
    ).get(),
    Sequence: Describer.$.value("`1` if `DurationStartDate` and `2` if `DurationEndDate`").get()
  },
  AmountSpecifiedInResult: {
    ...Describer.$.value("Present if `ResultAmountSterling` has value")
      .spi(
        "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > Outcome > ResultAmountSterling"
      )
      .get(),
    Amount: Describer.$.spi(
      "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > Outcome > ResultAmountSterling"
    ).get(),
    DecimalPlaces: Describer.$.spi(
      "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > Outcome > ResultAmountSterling"
    ).get(),
    Type: Describer.$.value("Look up amount type by AHO's `CJSresultCode`")
      .aho("AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > CJSresultCode")
      .get()
  },
  NumberSpecifiedInResult: {
    Number: Describer.$.value(
      "`PenaltyPoints` if `ResultCode` is `3008`",
      "`SecondaryDurationValue` if `ResultCode` is `1052` or `3105` (Curfew), and `SecondaryDurationUnit` is `H` (Hours)"
    )
      .spi(
        "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > ResultCode",
        "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > Outcome > PenaltyPoints",
        "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > Outcome > Duration > SecondaryDurationValue",
        "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > Outcome > Duration > SecondaryDurationUnit"
      )
      .get(),
    Type: Describer.$.value("Always set to `P`").get()
  },
  PleaStatus: Describer.$.value("Maps SPI code to CJS code", "SPI code if CJS code not found")
    .spi("DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Plea")
    .get(),
  Verdict: Describer.$.value("Maps SPI code to CJS code", "SPI code if CJS code not found")
    .spi("DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Finding")
    .get(),
  ModeOfTrialReason: Describer.$.value("Maps SPI code to CJS code", "SPI code if CJS code not found")
    .spi("DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > ModeOfTrial")
    .get(),
  ResultVariableText: Describer.$.spi(
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > ResultText"
  ).get(),
  WarrantIssueDate: Describer.$.value(
    "`DateOfHearing` if `CJSresultCode` is `4505`, `4575`, `4576`, `4577`, `4585`, or `4586`"
  )
    .spi("DeliverRequest > Message > ResultedCaseMessage > Session > CourtHearing > Hearing > DateOfHearing")
    .aho("AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > CJSresultCode")
    .get(),
  NumberOfOffencesTIC: Describer.$.value("TIC regex pattern as found in the `ResultText`")
    .spi("DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > ResultText")
    .get(),
  ResultQualifierVariable: {
    Code: Describer.$.value(
      "`ResultCodeQualifier`",
      "`BA` is also added when `CJSresultCode` is `3105` (Tagging fix add code), and there is a `Result` with a `ResultCodeQualifier` containing `BA` string and `CJSresultCode` being either `1115`, `1116`, `1141`, `1142`, or `1143` (Tagging fix remove)"
    )
      .spi(
        "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > ResultCodeQualifier"
      )
      .aho("AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > CJSresultCode")
      .get()
  }
}

export const offenceDescription = {
  ...Describer.$.spi("DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence"),
  CriminalProsecutionReference: {
    OffenceReason: {
      OffenceCode: {
        ...Describer.$.spi(
          "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceCode"
        ).get(),
        Reason: Describer.$.value("`OffenceCode` segment starting from the 4th character up to the 11th character")
          .spi(
            "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceCode"
          )
          .get(),
        Qualifier: Describer.$.value("`OffenceCode` segment starting from the 11th character to the end of the string")
          .spi(
            "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceCode"
          )
          .get(),
        FullCode: Describer.$.spi(
          "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceCode"
        ).get(),
        CommonLawOffence: Describer.$.value("Value is set to `COML` if `OffenceCode` starts with `COML`")
          .spi(
            "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceCode"
          )
          .get(),
        Indictment: Describer.$.value("Value is set to `XX00` if `OffenceCode` starts with `XX00`")
          .spi(
            "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceCode"
          )
          .get(),
        ActOrSource: Describer.$.value(
          "1st and 2nd characters of the `OffenceCode` when `OffenceCode` does not start with `COML` and `XX00`"
        )
          .spi(
            "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceCode"
          )
          .get(),
        Year: Describer.$.value(
          "3rd and 4th characters of the `OffenceCode` when `OffenceCode` does not start with `COML` and `XX00`"
        )
          .spi(
            "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceCode"
          )
          .get()
      }
    }
  },
  ArrestDate: Describer.$.spi(
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > ArrestDate"
  ).get(),
  ChargeDate: Describer.$.spi(
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > ChargeDate"
  ).get(),
  ActualOffenceDateCode: Describer.$.spi(
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceTiming > OffenceDateCode"
  ).get(),
  ActualOffenceStartDate: {
    StartDate: Describer.$.spi(
      "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceTiming > OffenceStart > OffenceDateStartDate"
    ).get()
  },
  ActualOffenceEndDate: {
    ...Describer.$.value("Only if `OffenceTiming.OffenceEnd` has value")
      .spi(
        "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceTiming > OffenceEnd"
      )
      .get(),
    EndDate: Describer.$.spi(
      "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceTiming > OffenceEnd > OffenceEndDate"
    ).get()
  },
  LocationOfOffence: Describer.$.spi(
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > LocationOfOffence"
  ).get(),
  ActualOffenceWording: Describer.$.spi(
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceWording"
  ).get(),
  AlcoholLevel: {
    ...Describer.$.spi(
      "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > AlcoholRelatedOffence"
    ).get(),
    Amount: Describer.$.spi(
      "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > AlcoholRelatedOffence > AlcoholLevelAmount"
    ).get(),
    Method: Describer.$.value("Maps SPI code to CJS code", "SPI code if CJS code not found")
      .spi(
        "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > AlcoholRelatedOffence > AlcoholLevelMethod"
      )
      .get()
  },
  OffenceTime: Describer.$.value("It's set to `OffenceStartTime` when `OffenceDateCode` value is not 4 (Between)")
    .spi(
      "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceTiming > OffenceStart > OffenceStartTime",
      "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceTiming > OffenceDateCode"
    )
    .get(),
  StartTime: Describer.$.value("It's set to `OffenceStartTime` when `OffenceDateCode` value is 4 (Between)")
    .spi(
      "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceTiming > OffenceStart > OffenceStartTime",
      "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceTiming > OffenceDateCode"
    )
    .get(),
  OffenceEndDate: Describer.$.spi(
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceTiming > OffenceEnd > OffenceEndDate"
  ).get(),
  CommittedOnBail: Describer.$.value("Always set to `D` (Don't know)").get(),
  CourtOffenceSequenceNumber: Describer.$.spi(
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceSequenceNumber"
  ).get(),
  ConvictionDate: Describer.$.value(
    "`ConvictionDate` if has value",
    "`DateOfHearing` if adjournment sine die condition met (Condition: There is at least a `ResultCode` with value `2007` in the offence and all `ResultCode`s in the offence have value and none of them are in the stop list)"
  )
    .spi(
      "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > ConvictionDate",
      "DeliverRequest > Message > ResultedCaseMessage > Session > CourtHearing > Hearing > DateOfHearing",
      "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > ResultCode"
    )
    .get()
}

export const ahoDescription = {
  AnnotatedHearingOutcome: {
    HearingOutcome: {
      Hearing: {
        ...Describer.$.spi(
          "DeliverRequest > Message > ResultedCaseMessage",
          "DeliverRequest > MessageIdentifier"
        ).get(),
        CourtHearingLocation: Describer.$.spi(
          "DeliverRequest > Message > ResultedCaseMessage > Session > CourtHearing > Hearing > CourtHearingLocation"
        ).get(),
        DateOfHearing: Describer.$.spi(
          "DeliverRequest > Message > ResultedCaseMessage > Session > CourtHearing > Hearing > DateOfHearing"
        ).get(),
        TimeOfHearing: Describer.$.spi(
          "DeliverRequest > Message > ResultedCaseMessage > Session > CourtHearing > Hearing > TimeOfHearing"
        ).get(),
        HearingLanguage: Describer.getText("Always `D`"),
        HearingDocumentationLanguage: Describer.getText("Always `D`"),
        DefendantPresentAtHearing: Describer.$.value(
          "Whichever has value in SPI Result: `CourtIndividualDefendant.PresentAtHearing` or `CourtCorporateDefendant.PresentAtHearing`"
        )
          .spi(
            "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > PresentAtHearing",
            "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtCorporateDefendant > PresentAtHearing"
          )
          .get(),
        SourceReference: Describer.$.value(
          "`DocumentName` is populated from `CourtIndividualDefendant` or `CourtCorporateDefendant` in SPI Result",
          "`DocumentType` value is `SPI Case Result`",
          "`UniqueID` value is `DeliverRequest.MessageIdentifier` in SPI Result"
        )
          .spi(
            "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > PersonDefendant > BasePersonDetails > PersonName",
            "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtCorporateDefendant > OrganisationName > OrganisationName",
            "DeliverRequest > MessageIdentifier"
          )
          .get(),
        CourtHouseCode: Describer.$.spi(
          "DeliverRequest > Message > ResultedCaseMessage > Session > CourtHearing > Hearing > PSAcode"
        ).get()
      },
      Case: {
        ...Describer.$.spi("DeliverRequest > Message > ResultedCaseMessage").get(),
        PTIURN: Describer.$.value("SPI Result's `PTIURN`")
          .spi("DeliverRequest > Message > ResultedCaseMessage > Session > Case > PTIURN")
          .get(),
        PreChargeDecisionIndicator: Describer.getText("Always `false`"),
        CourtReference: {
          ...Describer.getText("Only `MagistratesCourtReference` is used. Crown Court is not supported."),
          MagistratesCourtReference: Describer.$.value("SPI Result's `PTIURN`")
            .spi("DeliverRequest > Message > ResultedCaseMessage > Session > Case > PTIURN")
            .get()
        },
        HearingDefendant: {
          ArrestSummonsNumber: Describer.$.spi(
            "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > ProsecutorReference"
          ).get(),
          CourtPNCIdentifier: Describer.$.spi(
            "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > PersonDefendant > PNCidentifier",
            "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtCorporateDefendant > PNCidentifier"
          ).get(),
          DefendantDetail: {
            PersonName: {
              ...Describer.$.spi(
                "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > PersonDefendant"
              ).get(),
              Title: Describer.$.spi(
                "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > PersonDefendant > BasePersonDetails > PersonName > PersonTitle"
              ).get(),
              GivenName: Describer.$.value("`PersonGivenName1` + `PersonGivenName2` + `PersonGivenName3`")
                .spi(
                  "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > PersonDefendant > BasePersonDetails > PersonName > PersonGivenName1",
                  "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > PersonDefendant > BasePersonDetails > PersonName > PersonGivenName2",
                  "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > PersonDefendant > BasePersonDetails > PersonName > PersonGivenName3"
                )
                .get(),
              FamilyName: Describer.$.spi(
                "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > PersonDefendant > BasePersonDetails > PersonName > PersonFamilyName"
              ).get()
            },
            BirthDate: Describer.$.spi(
              "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > PersonDefendant > BasePersonDetails > Birthdate"
            ).get(),
            Gender: Describer.$.spi(
              "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > PersonDefendant > BasePersonDetails > Gender"
            ).get()
          },
          Address: {
            ...Describer.$.spi(
              "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > Address > SimpleAddress",
              "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > Address > ComplexAddress",
              "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtCorporateDefendant > Address > SimpleAddress",
              "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtCorporateDefendant > Address > ComplexAddress"
            ).get(),
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
          RemandStatus: Describer.$.value("Maps SPI code to CJS code", "SPI code if CJS code not found")
            .spi(
              "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > BailStatus",
              "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtCorporateDefendant > BailStatus"
            )
            .get(),
          BailConditions: Describer.$.value(
            "`BailConditions` if has value",
            "Also `With Electronic Tagging` value is added when\n- `BailConditions` is not empty\n- `BA` result qualifier code is generated. `BA` is generated when `CJSresultCode` in one of the `Result`s is `3105` (Tagging fix add code), and there is a `Result` with a `ResultCodeQualifier` containing `BA` string and `CJSresultCode` being either `1115`, `1116`, `1141`, `1142`, or `1143` (Tagging fix remove)"
          )
            .spi(
              "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > PersonDefendant > BailConditions"
            )
            .aho(
              "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > CJSresultCode",
              "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > ResultCodeQualifier"
            )
            .get(),
          ReasonForBailConditions: Describer.$.spi(
            "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > ReasonForBailConditionsOrCustody"
          ).get(),
          OrganisationName: Describer.$.spi(
            "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > OrganisationName > OrganisationName"
          ).get()
        }
      }
    }
  }
}
