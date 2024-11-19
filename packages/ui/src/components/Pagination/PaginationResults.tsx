interface Props {
  casesPerPage: number
  pageNum: number
  totalCases: number
}

const PaginationResults: React.FC<Props> = ({ casesPerPage, pageNum, totalCases }: Props) => {
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
  return <p className={"moj-pagination__results"}>{content}</p>
}

export default PaginationResults
