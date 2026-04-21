import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000726RENQASIPNCA05A73000017300000120210903102673000001                                             050002947</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/27Y     SUBSEQUENTRE            </IDS>
        <CCR>K21/2732/21E                   </CCR>
        <COF>K001    5:5:5:1      TH68006 28112010                </COF>
        <COF>K002    5:7:11:10    TH68151 28112010                </COF>
      </ASI>
      <GMT>000009073ENQR000726R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-1.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "SUBSEQUENTRE",
      croNumber: "",
      arrestSummonsNumber: "14/01ZD/01/449843Q",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/27Y",
      remandDate: "2011-09-26",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2011-10-26",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      }
    },
    count: 1
  }),
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000727RENQASIPNCA05A73000017300000120210903102673000001                                             050002949</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/27Y     SUBSEQUENTRE            </IDS>
        <CCR>K21/2732/21E                   </CCR>
        <COF>K001    5:5:5:1      TH68006 28112010                </COF>
        <COF>K002    5:7:11:10    TH68151 28112010                </COF>
      </ASI><GMT>000009073ENQR000727R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "SUBSEQUENTRE",
      croNumber: "",
      arrestSummonsNumber: "14/01ZD/01/449843Q",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/27Y",
      remandDate: "2011-10-26",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2011-11-26",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      }
    },
    count: 1
  })
]
