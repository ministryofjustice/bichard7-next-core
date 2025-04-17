import { PaginationParagraph } from "./PaginationResults.styles"

interface Props {
  pageNum: number
  casesPerPage: number
  totalCases: number
}

const PaginationResults: React.FC<Props> = ({ pageNum, casesPerPage, totalCases }: Props) => {
  const content =
    totalCases > 0 ? (
      <>
        {"Showing "}
        <b>{(pageNum - 1) * casesPerPage + 1}</b>
        {" to "}
        <b>{Math.min(pageNum * casesPerPage, totalCases)}</b>
        {" of "}
        <b>{totalCases}</b>
        {" cases"}
      </>
    ) : (
      <>
        {"Showing "}
        <b>{"0"}</b>
        {" cases"}
      </>
    )
  return (
    <PaginationParagraph className={"moj-pagination__results"} aria-live="polite" role="status" aria-atomic="true">
      {content}
    </PaginationParagraph>
  )
}

export default PaginationResults
