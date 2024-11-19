import defaults from "defaults"

import ConditionalRender from "../ConditionalRender"
import CasesPerPage from "./CasesPerPage"
import { PaginationBar } from "./Pagination.styles"
import PaginationNavigation from "./PaginationNavigation"
import PaginationResults from "./PaginationResults"

interface Props {
  casesPerPage?: number
  name?: string
  pageNum?: number
  totalCases: number
}

const Pagination: React.FC<Props> = ({
  casesPerPage = defaults.maxPageItems,
  name,
  pageNum = 1,
  totalCases
}: Props) => {
  return (
    <ConditionalRender isRendered={totalCases > 0}>
      <PaginationBar className={"pagination-bar"} id={`${name}-pagination-bar`}>
        <PaginationResults casesPerPage={casesPerPage} pageNum={pageNum} totalCases={totalCases} />
        <CasesPerPage
          casesPerPage={casesPerPage}
          options={[25, 50, 100, 200]}
          pageNum={pageNum}
          selected={casesPerPage}
        />
        <PaginationNavigation name={name} pageNum={pageNum} totalPages={Math.ceil(totalCases / casesPerPage)} />
      </PaginationBar>
    </ConditionalRender>
  )
}

export default Pagination
