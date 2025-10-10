import addQueryParams from "utils/addQueryParams"
import Link from "./Link"

interface Props {
  pageNumber: number
  totalItems: number
  maxItemsPerPage: number
  href: string
  className?: string
}

const Pagination = ({ pageNumber, totalItems, maxItemsPerPage, href, className }: Props) => {
  if (totalItems === 0) {
    return <></>
  }

  const nextPage = addQueryParams(href, {
    page: pageNumber + 1
  })

  const prevPage = addQueryParams(href, {
    page: pageNumber - 1
  })

  const pageNumberStyle = {
    style: {
      padding: "10px"
    },
    spacing: {
      paddingLeft: "0px"
    }
  }

  let styles = { ...pageNumberStyle.style }

  if (pageNumber === 0) {
    styles = { ...styles, ...pageNumberStyle.spacing }
  }

  const pageString = `Page ${pageNumber + 1} of ${Math.ceil(totalItems / maxItemsPerPage)}`

  return (
    <div className={`govuk-hint${className ? ` ${className}` : ""}`}>
      <Link href={prevPage} data-test="Prev">
        {pageNumber > 0 && "< Prev"}
      </Link>
      <span style={styles}>{pageString}</span>
      <Link href={nextPage} data-test="Next">
        {pageNumber + 1 < totalItems / maxItemsPerPage && "Next >"}
      </Link>
    </div>
  )
}

export default Pagination
