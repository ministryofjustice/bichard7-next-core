import { useRouter } from "next/router"
import { CasesPerPagePicker } from "./CasesPerPage.styles"

interface Props {
  options: number[]
  selected: number
  pageNum: number
  casesPerPage: number
}

const CasesPerPage: React.FC<Props> = ({ options, selected, pageNum, casesPerPage }: Props) => {
  const router = useRouter()

  return (
    <div className="moj-pagination__results">
      {"View "}
      <CasesPerPagePicker
        onChange={(event) => {
          const newCasesPerPage = event.target.value

          // Ensure that the first case on the page remains after changing number of cases per page
          const firstCaseIndex = (pageNum - 1) * casesPerPage + 1
          const newPageNum = Math.floor(firstCaseIndex / parseInt(newCasesPerPage, 10)) + 1

          router.push({ query: { ...router.query, maxPageItems: newCasesPerPage, page: newPageNum } })
        }}
        value={selected}
        className={`cases-per-page cases-per-page-picker`}
        aria-label="Cases per page"
      >
        {options.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </CasesPerPagePicker>
      {" cases per page"}
    </div>
  )
}

export default CasesPerPage
