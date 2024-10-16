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
  pageNum: number
  totalPages: number
  className?: string
  linkedPageNum?: number
}

const PageNum: React.FC<PageNumProps> = ({ pageNum, totalPages, className, linkedPageNum }: PageNumProps) => {
  const { query } = useRouter()

  const label = linkedPageNum ? (
    <Link
      className="moj-pagination__link"
      href={{ query: { ...query, page: linkedPageNum } }}
      aria-label={`Page ${pageNum} of ${totalPages}`}
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
  pageNum: number
  totalPages: number
  name?: string
}

const PaginationNavigation: React.FC<PaginationNavigationProps> = ({
  pageNum,
  totalPages,
  name
}: PaginationNavigationProps) => {
  const pageLinks = generatePageLinks(pageNum, totalPages)

  return (
    <nav
      className={"moj-pagination"}
      aria-label={`Pagination navigation ${name}`}
      id={`pagination-navigation${name && "-" + name}`}
    >
      <ul className="moj-pagination__list">
        {pageLinks.map((pageLink, index) => {
          if (pageLink.label === "Previous") {
            return (
              <RelativeNavigation
                className={"prev"}
                label="Previous"
                linkedPageNum={pageLink.destinationPage || 1}
                key={index}
              />
            )
          } else if (pageLink.label === "Next") {
            return (
              <RelativeNavigation
                className={"next"}
                label="Next"
                linkedPageNum={pageLink.destinationPage || totalPages}
                key={index}
              />
            )
          } else if (pageLink.label === "Ellipsis") {
            return <Ellipsis key={index} />
          } else if (!pageLink.destinationPage) {
            return (
              <PageNum
                pageNum={pageLink.label}
                totalPages={totalPages}
                className="moj-pagination__item--active"
                key={index}
              />
            )
          } else {
            return (
              <PageNum
                pageNum={pageLink.label}
                totalPages={totalPages}
                linkedPageNum={pageLink.destinationPage}
                key={index}
              />
            )
          }
        })}
      </ul>
    </nav>
  )
}

export default PaginationNavigation
