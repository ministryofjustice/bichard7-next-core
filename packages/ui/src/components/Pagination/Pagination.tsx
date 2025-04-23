import { RefreshButton } from "components/Buttons/RefreshButton"
import defaults from "defaults"
import { useRouter } from "next/router"
import { useEffect, useRef } from "react"
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

const usePaginationAnnouncer = (pageNum: number, totalPages: number) => {
  const announcerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (announcerRef.current) {
      announcerRef.current.textContent = `Page ${pageNum} of ${totalPages} loaded.`
    }
  }, [pageNum, totalPages])

  useEffect(() => {
    const handleRouteChangeComplete = () => {
      if (announcerRef.current) {
        announcerRef.current.textContent = `Page ${pageNum} of ${totalPages} loaded.`
      }
    }
    router.events.on("routeChangeComplete", handleRouteChangeComplete)

    return () => {
      router.events.off("routeChangeComplete", handleRouteChangeComplete)
    }
  }, [pageNum, totalPages, router])

  return announcerRef
}

const Pagination: React.FC<Props> = ({
  pageNum = 1,
  casesPerPage = defaults.maxPageItems,
  totalCases,
  name
}: Props) => {
  const totalPages = Math.ceil(totalCases / casesPerPage)
  const announcerRef = usePaginationAnnouncer(pageNum, totalPages)

  return (
    <ConditionalRender isRendered={totalCases > 0}>
      <div aria-live="polite" aria-atomic="true" ref={announcerRef} className="govuk-visually-hidden"></div>
      <PaginationBar id={`${name}-pagination-bar`} className={"pagination-bar"}>
        <RefreshButton location={name ?? "no-location"} />
        <PaginationResults pageNum={pageNum} casesPerPage={casesPerPage} totalCases={totalCases} />
        <CasesPerPage
          pageNum={pageNum}
          casesPerPage={casesPerPage}
          options={[25, 50, 100, 200]}
          selected={casesPerPage}
        />
        <PaginationNavigation pageNum={pageNum} totalPages={totalPages} name={name} />
      </PaginationBar>
    </ConditionalRender>
  )
}

export default Pagination
