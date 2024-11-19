import type Bichard from "../../utils/world"

import { mockEnquiryFromNCM } from "../../utils/pncMocks"

export default (ncm: string, world: Bichard) => [mockEnquiryFromNCM(ncm, world, { count: 1 })]
