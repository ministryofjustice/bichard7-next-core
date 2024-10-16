import defaults from "defaults"
import ConditionalRender from "../ConditionalRender"
import CasesPerPage from "./CasesPerPage"
import { PaginationBar } from "./Pagination.styles"
import PaginationNavigation from "./PaginationNavigation"
import PaginationResults from "./PaginationResults"

interface Props {
  pageNum?: number
  casesPerPage?: number
  totalCases: number
  name?: string
}

const Pagination: React.FC<Props> = ({
  pageNum = 1,
  casesPerPage = defaults.maxPageItems,
  totalCases,
  name
}: Props) => {
  return (
    <ConditionalRender isRendered={totalCases > 0}>
      <PaginationBar id={`${name}-pagination-bar`} className={"pagination-bar"}>
        <PaginationResults pageNum={pageNum} casesPerPage={casesPerPage} totalCases={totalCases} />
        <CasesPerPage
          pageNum={pageNum}
          casesPerPage={casesPerPage}
          options={[25, 50, 100, 200]}
          selected={casesPerPage}
        />
        <PaginationNavigation pageNum={pageNum} totalPages={Math.ceil(totalCases / casesPerPage)} name={name} />
      </PaginationBar>
    </ConditionalRender>
  )
}

export default Pagination
