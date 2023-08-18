class Describer {
  private _value: string[]

  private _example: string

  private _spiResult: string[]

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

  value = (v: string | string[]) => {
    this._value = Array.isArray(v) ? v : [v]
    return this
  }

  example = (e: string) => {
    this._example = e
    return this
  }

  spi = (s: string | string[]) => {
    this._spiResult = Array.isArray(s) ? s : [s]
    return this
  }

  get = () => {
    let description = ""
    if (this._value) {
      description += "<h5>Value</h5>"
      if (Array.isArray(this._value)) {
        description += `<p><ul>${this._value.map((v) => `<li>${v}</li>`).join("")}</ul></p>`
      } else {
        description += `<p>${this._value}</p>`
      }
    }

    if (this._spiResult && this._spiResult.length > 0) {
      description += `<h5>SPI Result</h5><p><ul>${this._spiResult
        .map((f) => `<li><a href="spi.schema.html#${this.generateLinkQuery(f)}" target="_blank">${f}</a></li>`)
        .join("")}</ul></p>`
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
  OrganisationUnitCode: Describer.$.value("Top level + Second level + Third level + Bottom level")
    .example("B03AX00")
    .get()
}

export const ahoDescription = {
  AnnotatedHearingOutcome: {
    HearingOutcome: {
      Hearing: {
        ...Describer.$.spi([
          "DeliverRequest > Message > ResultedCaseMessage",
          "DeliverRequest > MessageIdentifier"
        ]).get(),
        CourtHearingLocation: Describer.$.spi([
          "DeliverRequest > Message > ResultedCaseMessage > Session > CourtHearing > Hearing > CourtHearingLocation"
        ]).get(),
        DateOfHearing: Describer.$.spi([
          "DeliverRequest > Message > ResultedCaseMessage > Session > CourtHearing > Hearing > DateOfHearing"
        ]).get(),
        TimeOfHearing: Describer.$.spi([
          "DeliverRequest > Message > ResultedCaseMessage > Session > CourtHearing > Hearing > TimeOfHearing"
        ]).get(),
        HearingLanguage: Describer.getText("Always `D`"),
        HearingDocumentationLanguage: Describer.getText("Always `D`"),
        DefendantPresentAtHearing: Describer.$.value(
          "Whichever has value in SPI Result: `CourtIndividualDefendant.PresentAtHearing` or `CourtCorporateDefendant.PresentAtHearing`"
        )
          .spi([
            "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > PresentAtHearing",
            "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtCorporateDefendant > PresentAtHearing"
          ])
          .get(),
        SourceReference: Describer.$.value([
          "`DocumentName` is populated from `CourtIndividualDefendant` or `CourtCorporateDefendant` in SPI Result",
          "`DocumentType` value is `SPI Case Result`",
          "`UniqueID` value is `DeliverRequest.MessageIdentifier` in SPI Result"
        ])
          .spi([
            "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > PersonDefendant > BasePersonDetails > PersonName",
            "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtCorporateDefendant > OrganisationName > OrganisationName",
            "DeliverRequest > MessageIdentifier"
          ])
          .get(),
        CourtHouseCode: Describer.$.spi([
          "DeliverRequest > Message > ResultedCaseMessage > Session > CourtHearing > Hearing > PSAcode"
        ]).get()
      },
      Case: {
        ...Describer.$.spi(["DeliverRequest > Message > ResultedCaseMessage"]).get(),
        PTIURN: Describer.$.value("SPI Result's `PTIURN`")
          .spi(["DeliverRequest > Message > ResultedCaseMessage > Session > Case > PTIURN"])
          .get(),
        PreChargeDecisionIndicator: Describer.getText("Always `false`"),
        CourtReference: {
          ...Describer.getText("Only `MagistratesCourtReference` is used. Crown Court is not supported."),
          MagistratesCourtReference: Describer.$.value("SPI Result's `PTIURN`")
            .spi(["DeliverRequest > Message > ResultedCaseMessage > Session > Case > PTIURN"])
            .get()
        }
      }
    }
  }
}
