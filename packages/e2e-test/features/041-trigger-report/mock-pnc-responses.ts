import type Bichard from "../../utils/world"

import { dummyUpdate, mockEnquiryFromNCM } from "../../utils/pncMocks"

export default (ncm: string, world: Bichard) => [
  { ...mockEnquiryFromNCM(ncm.replace("pnc-data.xml", "pnc-data-1.xml"), world), count: 1 },
  { ...mockEnquiryFromNCM(ncm.replace("pnc-data.xml", "pnc-data-2.xml"), world), count: 1 },
  dummyUpdate
]
