import { useRouter } from "next/router"

import { CasesPerPagePicker } from "./CasesPerPage.styles"

interface Props {
  casesPerPage: number
  options: number[]
  pageNum: number
  selected: number
}

const CasesPerPage: React.FC<Props> = ({ casesPerPage, options, pageNum, selected }: Props) => {
  const router = useRouter()

  return (
    <div className="moj-pagination__results">
      {"View "}
      <CasesPerPagePicker
        aria-label="Cases per page"
        className={`cases-per-page cases-per-page-picker`}
        onChange={(event) => {
          const newCasesPerPage = event.target.value

          // Ensure that the first case on the page remains after changing number of cases per page
          const firstCaseIndex = (pageNum - 1) * casesPerPage + 1
          const newPageNum = Math.floor(firstCaseIndex / parseInt(newCasesPerPage, 10)) + 1

          router.push({ query: { ...router.query, maxPageItems: newCasesPerPage, page: newPageNum } })
        }}
        value={selected}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </CasesPerPagePicker>
      {" cases per page"}
    </div>
  )
}

export default CasesPerPage
