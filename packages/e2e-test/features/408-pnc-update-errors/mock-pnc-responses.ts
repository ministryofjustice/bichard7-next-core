import { mockEnquiryFromNCM } from "../../utils/pncMocks"

import type Bichard from "../../utils/world"

export default (ncm: string, world: Bichard) => [mockEnquiryFromNCM(ncm, world)]
