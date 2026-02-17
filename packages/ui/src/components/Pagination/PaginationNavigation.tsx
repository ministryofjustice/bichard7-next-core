import Link from "next/link"
import { useRouter } from "next/router"
import { generatePageLinks } from "./generatePageLinks"
import { PaginationNav } from "./PaginationNavigation.styles"

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

  const nextSvg = (
    <svg
      className="govuk-pagination__icon govuk-pagination__icon--next"
      xmlns="http://www.w3.org/2000/svg"
      height="13"
      width="15"
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 15 13"
    >
      <path d="m8.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z"></path>
    </svg>
  )
  const prevSvg = (
    <svg
      className="govuk-pagination__icon govuk-pagination__icon--prev"
      xmlns="http://www.w3.org/2000/svg"
      height="13"
      width="15"
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 15 13"
    >
      <path d="m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z"></path>
    </svg>
  )

  return (
    <li className={`govuk-pagination__item govuk-pagination__${className}`}>
      <Link
        className="govuk-link govuk-pagination__link"
        href={{ query: { ...query, page: linkedPageNum } }}
        aria-label={label}
      >
        {label === "Previous" ? prevSvg : undefined}
        <span className="govuk-pagination__link-title">
          {label}
          <span className="govuk-visually-hidden">{" page"}</span>
        </span>
        {label === "Next" ? nextSvg : undefined}
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
      className="govuk-link govuk-pagination__link"
      href={{ query: { ...query, page: linkedPageNum } }}
      aria-label={`Page ${pageNum} of ${totalPages}`}
    >
      {pageNum}
    </Link>
  ) : (
    pageNum
  )

  return <li className={"govuk-pagination__item" + (className ? " " + className : "")}>{label}</li>
}

const Ellipsis = () => <li className="govuk-pagination__item govuk-pagination__item--ellipsis">{"\u22EF"}</li>

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
    <PaginationNav
      className={"govuk-pagination"}
      aria-label={`Pagination navigation ${name}`}
      id={`pagination-navigation${name && "-" + name}`}
    >
      <ul className="govuk-pagination__list">
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
                className="govuk-pagination__item--current"
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
    </PaginationNav>
  )
}

export default PaginationNavigation
