import { CsrfTokenContext, CsrfTokenContextType } from "context/CsrfTokenContext"
import { CurrentUserContext, CurrentUserContextType } from "context/CurrentUserContext"
import { isError } from "lodash"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import withCsrf from "middleware/withCsrf/withCsrf"
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import { ParsedUrlQuery } from "querystring"
import { useState } from "react"
import { courtCaseToDisplayPartialCourtCaseDto } from "services/dto/courtCaseDto"
import { userToDisplayFullUserDto } from "services/dto/userDto"
import getDataSource from "services/getDataSource"
import getCourtCasesForCaseDetailsReport from "services/reports/getCourtCasesForCaseDetailsReport"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import { DisplayPartialCourtCase } from "types/display/CourtCases"
import { DisplayFullUser } from "types/display/Users"
import { CaseDetailsReportType, ReportQueryParams } from "types/ReportQueryParams"
import { validateDateRange } from "utils/validators/validateDateRange"

const extractCaseDetailsParamsFromQuery = (query: ParsedUrlQuery): ReportQueryParams => {
  const dateRange = validateDateRange({
    from: query.from,
    to: `${query.to} 23:59:59`
  })

  return {
    reportDateRange: dateRange,
    caseDetailsReportType: query.caseDetailReportType as CaseDetailsReportType
  }
}

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query, csrfToken } = context as AuthenticationServerSidePropsContext &
      CsrfServerSidePropsContext
    const { ...caseDetailQueryParams } = query
    const caseDetailsQuery = extractCaseDetailsParamsFromQuery(caseDetailQueryParams)
    const dataSource = await getDataSource()

    const courtCasesForCaseDetailsReport = await getCourtCasesForCaseDetailsReport(
      dataSource,
      currentUser,
      caseDetailsQuery.reportDateRange,
      caseDetailsQuery.caseDetailsReportType
    )

    if (isError(courtCasesForCaseDetailsReport)) {
      throw courtCasesForCaseDetailsReport
    }

    const props = {
      csrfToken,
      user: userToDisplayFullUserDto(currentUser),
      courtCasesForCaseDetailsReport: courtCasesForCaseDetailsReport.result.map((courtCase) =>
        courtCaseToDisplayPartialCourtCaseDto(courtCase, currentUser)
      )
    }

    return {
      props
    }
  }
)

interface Props {
  csrfToken: string
  user: DisplayFullUser
  courtCasesForCaseDetailsReport: DisplayPartialCourtCase[]
}

const CaseDetailReportPage: NextPage<Props> = (props) => {
  const { csrfToken, user, courtCasesForCaseDetailsReport } = props

  const [csrfTokenContext] = useState<CsrfTokenContextType>({ csrfToken })
  const [currentUserContext] = useState<CurrentUserContextType>({ currentUser: user })

  return (
    <>
      <CsrfTokenContext.Provider value={csrfTokenContext}>
        <CurrentUserContext.Provider value={currentUserContext}>
          {/* { TODO: waiting for design } */}
          <h1>{"Case report"}</h1>
          {courtCasesForCaseDetailsReport.map((r) => {
            return <p key={r.errorId}>{r.asn}</p>
          })}
        </CurrentUserContext.Provider>
      </CsrfTokenContext.Provider>
    </>
  )
}

export default CaseDetailReportPage
