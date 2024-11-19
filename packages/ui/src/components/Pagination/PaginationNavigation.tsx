import Link from "next/link"
import { useRouter } from "next/router"

import { generatePageLinks } from "./generatePageLinks"

interface RelativeNavigationProps {
  className: string
  label: string
  linkedPageNum: number
}

const RelativeNavigation: React.FC<RelativeNavigationProps> = ({
  className,
  label,
  linkedPageNum
}: RelativeNavigationProps) => {
  const { query } = useRouter()

  return (
    <li className={`moj-pagination__item moj-pagination__item--${className}`}>
      <Link className="moj-pagination__link" href={{ query: { ...query, page: linkedPageNum } }}>
        {label}
        <span className="govuk-visually-hidden">{" page"}</span>
      </Link>
    </li>
  )
}

interface PageNumProps {
  className?: string
  linkedPageNum?: number
  pageNum: number
  totalPages: number
}

const PageNum: React.FC<PageNumProps> = ({ className, linkedPageNum, pageNum, totalPages }: PageNumProps) => {
  const { query } = useRouter()

  const label = linkedPageNum ? (
    <Link
      aria-label={`Page ${pageNum} of ${totalPages}`}
      className="moj-pagination__link"
      href={{ query: { ...query, page: linkedPageNum } }}
    >
      {pageNum}
    </Link>
  ) : (
    pageNum
  )
  return <li className={"moj-pagination__item" + (className ? " " + className : "")}>{label}</li>
}

const Ellipsis = () => <li className="moj-pagination__item moj-pagination__item--dots">{"…"}</li>

interface PaginationNavigationProps {
  name?: string
  pageNum: number
  totalPages: number
}

const PaginationNavigation: React.FC<PaginationNavigationProps> = ({
  name,
  pageNum,
  totalPages
}: PaginationNavigationProps) => {
  const pageLinks = generatePageLinks(pageNum, totalPages)

  return (
    <nav
      aria-label={`Pagination navigation ${name}`}
      className={"moj-pagination"}
      id={`pagination-navigation${name && "-" + name}`}
    >
      <ul className="moj-pagination__list">
        {pageLinks.map((pageLink, index) => {
          if (pageLink.label === "Previous") {
            return (
              <RelativeNavigation
                className={"prev"}
                key={index}
                label="Previous"
                linkedPageNum={pageLink.destinationPage || 1}
              />
            )
          } else if (pageLink.label === "Next") {
            return (
              <RelativeNavigation
                className={"next"}
                key={index}
                label="Next"
                linkedPageNum={pageLink.destinationPage || totalPages}
              />
            )
          } else if (pageLink.label === "Ellipsis") {
            return <Ellipsis key={index} />
          } else if (!pageLink.destinationPage) {
            return (
              <PageNum
                className="moj-pagination__item--active"
                key={index}
                pageNum={pageLink.label}
                totalPages={totalPages}
              />
            )
          } else {
            return (
              <PageNum
                key={index}
                linkedPageNum={pageLink.destinationPage}
                pageNum={pageLink.label}
                totalPages={totalPages}
              />
            )
          }
        })}
      </ul>
    </nav>
  )
}

export default PaginationNavigation
