import type Bichard from "../../utils/world"

import { dummyUpdate, mockEnquiryFromNCM } from "../../utils/pncMocks"

export default (ncm: string, world: Bichard) => [mockEnquiryFromNCM(ncm, world), dummyUpdate]
