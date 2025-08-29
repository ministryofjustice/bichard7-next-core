import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  { ...policeApi.mockEnquiryFromNcm(ncm.replace("pnc-data.xml", "pnc-data-1.xml")), count: 1 },
  { ...policeApi.mockEnquiryFromNcm(ncm.replace("pnc-data.xml", "pnc-data-2.xml")), count: 1 },
  policeApi.generateDummyUpdate()
]
