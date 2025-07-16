import { mockEnquiryFromNCM } from "../../utils/ledsMocks"

import type Bichard from "../../utils/world"

export default (ncm: string, world: Bichard) => [mockEnquiryFromNCM(ncm, world)]
