type Offence = {
  resultCodes: number[]
}

type GenerateMessageOptions = {
  offences: Offence[]
}

const generateResults = (resultCodes: number[]): string => {
  return resultCodes
    .map(
      (resultCode) => `
  <DC:Result>
    <DC:ResultCode>${resultCode}</DC:ResultCode>
    <DC:ResultText>RESULT_TEXT</DC:ResultText>
  </DC:Result>`
    )
    .join("")
}
const generateOffences = (options: GenerateMessageOptions) => {
  return options.offences
    .map(
      (offence: Offence, index) => `
  <DC:Offence>
    <DC:BaseOffenceDetails>
      <DC:OffenceSequenceNumber>${(index + 1).toString().padStart(3, "0")}</DC:OffenceSequenceNumber>
      <DC:OffenceCode>TH68006</DC:OffenceCode>
      <DC:OffenceWording>Theft of pedal cycle.</DC:OffenceWording>
      <DC:OffenceTiming>
        <DC:OffenceDateCode>1</DC:OffenceDateCode>
        <DC:OffenceStart>
          <DC:OffenceDateStartDate>2010-11-28</DC:OffenceDateStartDate>
        </DC:OffenceStart>
      </DC:OffenceTiming>
      <DC:ChargeDate>2010-12-02</DC:ChargeDate>
      <DC:ArrestDate>2010-12-01</DC:ArrestDate>
      <DC:LocationOfOffence>Kingston High Street</DC:LocationOfOffence>
    </DC:BaseOffenceDetails>
    <DC:InitiatedDate>2008-07-11</DC:InitiatedDate>
    <DC:Plea>2</DC:Plea>
    <DC:ModeOfTrial>01</DC:ModeOfTrial>
    <DC:FinalDisposalIndicator>N</DC:FinalDisposalIndicator>
    <DC:ConvictionDate>2011-09-26</DC:ConvictionDate>
    <DC:Finding>G</DC:Finding>
    ${generateResults(offence.resultCodes)}
  </DC:Offence>`
    )
    .join("")
}

export default (options: GenerateMessageOptions): string => {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <DeliverRequest xmlns="http://schemas.cjse.gov.uk/messages/deliver/2006-05" xmlns:ex="http://schemas.cjse.gov.uk/messages/exception/2006-06" xmlns:mf="http://schemas.cjse.gov.uk/messages/format/2006-05" xmlns:mm="http://schemas.cjse.gov.uk/messages/metadata/2006-05" xmlns:msg="http://schemas.cjse.gov.uk/messages/messaging/2006-05" xmlns:xmime="http://www.w3.org/2005/05/xmlmime" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://schemas.cjse.gov.uk/messages/deliver/2006-05 C:ClearCasekel-masri_BR7_0_1_intgBR7XML_ConverterSourceClassGenerationschemasReceiveDeliverServiceDeliverService-v1-0.xsd">
    <msg:MessageIdentifier>EXTERNAL_CORRELATION_ID</msg:MessageIdentifier>
    <msg:RequestingSystem>
      <msg:Name>CJSE</msg:Name>
      <msg:OrgUnitCode>Z000000</msg:OrgUnitCode>
      <msg:Environment>Production</msg:Environment>
    </msg:RequestingSystem>
    <msg:AckRequested>1</msg:AckRequested>
    <mm:MessageMetadata SchemaVersion="1.0">
      <mm:OriginatingSystem>
        <msg:Name>BICHARD7</msg:Name>
        <msg:OrgUnitCode>C234567</msg:OrgUnitCode>
        <msg:Environment>Production</msg:Environment>
      </mm:OriginatingSystem>
      <mm:DataController>
        <msg:Organisation>C765432</msg:Organisation>
        <msg:ReferencedElementURI>http://www.altova.com</msg:ReferencedElementURI>
      </mm:DataController>
      <mm:CreationDateTime>2001-12-17T09:30:47-05:00</mm:CreationDateTime>
      <mm:ExpiryDateTime>2031-12-17T09:30:47-05:00</mm:ExpiryDateTime>
      <mm:SenderRequestedDestination>String</mm:SenderRequestedDestination>
    </mm:MessageMetadata>
    <mf:MessageFormat SchemaVersion="1.0">
      <mf:MessageType>
        <msg:Type>SPIResults</msg:Type>
        <msg:Version>1.200</msg:Version>
      </mf:MessageType>
      <mf:MessageSchema>
        <msg:Namespace>http://www.dca.gov.uk/xmlschemas/libra</msg:Namespace>
        <msg:Version>TBC</msg:Version>
      </mf:MessageSchema>
    </mf:MessageFormat>
    <Message>
      <DC:ResultedCaseMessage xmlns:DC="http://www.dca.gov.uk/xmlschemas/libra" Flow="ResultedCasesForThePolice" Interface="LibraStandardProsecutorPolice" SchemaVersion="0.6g">
        <DC:Session>
          <DC:CourtHearing>
            <DC:Hearing>
              <DC:CourtHearingLocation>B01EF01</DC:CourtHearingLocation>
              <DC:DateOfHearing>2011-09-26</DC:DateOfHearing>
              <DC:TimeOfHearing>10:00:00</DC:TimeOfHearing>
            </DC:Hearing>
            <DC:PSAcode>2576</DC:PSAcode>
          </DC:CourtHearing>
          <DC:Case>
            <DC:PTIURN>01ZD0303908</DC:PTIURN>
            <DC:Defendant>
              <DC:ProsecutorReference>1101ZD0100000410769X</DC:ProsecutorReference>
              <DC:CourtIndividualDefendant>
                <DC:PersonDefendant>
                  <DC:BasePersonDetails>
                    <DC:PersonName>
                      <DC:PersonTitle>Mr</DC:PersonTitle>
                      <DC:PersonGivenName1>TRPRTWELVE</DC:PersonGivenName1>
                      <DC:PersonFamilyName>TRTHREE</DC:PersonFamilyName>
                    </DC:PersonName>
                    <DC:Birthdate>1948-11-11</DC:Birthdate>
                    <DC:Gender>1</DC:Gender>
                  </DC:BasePersonDetails>
                </DC:PersonDefendant>
                <DC:BailStatus>U</DC:BailStatus>
                <DC:Address>
                  <DC:SimpleAddress>
                    <DC:AddressLine1>ScenarioD Address Line 1</DC:AddressLine1>
                    <DC:AddressLine2>ScenarioD Address Line 2</DC:AddressLine2>
                    <DC:AddressLine3>ScenarioD Address Line 3</DC:AddressLine3>
                  </DC:SimpleAddress>
                </DC:Address>
                <DC:PresentAtHearing>A</DC:PresentAtHearing>
              </DC:CourtIndividualDefendant>
              ${generateOffences(options)}
            </DC:Defendant>
          </DC:Case>
        </DC:Session>
      </DC:ResultedCaseMessage>
    </Message>
  </DeliverRequest>`.trim()
}
