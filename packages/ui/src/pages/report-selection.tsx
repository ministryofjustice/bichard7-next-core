import Head from "next/head"
import Layout from "../components/Layout"
import { CurrentUserContext, CurrentUserContextType } from "context/CurrentUserContext"
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import { withAuthentication, withMultipleServerSideProps } from "../middleware"
import withCsrf from "../middleware/withCsrf/withCsrf"
import CsrfServerSidePropsContext from "../types/CsrfServerSidePropsContext"
import AuthenticationServerSidePropsContext from "../types/AuthenticationServerSidePropsContext"
import { userToDisplayFullUserDto } from "../services/dto/userDto"
import { DisplayFullUser } from "types/display/Users"
import { ParsedUrlQuery } from "querystring"
import { useRouter } from "next/router"
import { useState } from "react"
import { HeaderWrapper } from "../components/Card/Card.styles"
import DateInput from "../components/CustomDateInput/DateInput"
import { FormGroup } from "../components/FormGroup"
import { Select } from "../components/Select"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query /*csrfToken*/ } = context as AuthenticationServerSidePropsContext &
      CsrfServerSidePropsContext
    const { previousPath } = query as { previousPath: string }

    const props = {
      //csrfToken,
      user: userToDisplayFullUserDto(currentUser),
      previousPath: previousPath ?? null
    }

    return { props }
  }
)

interface Props {
  //csrfToken: string
  user: DisplayFullUser
  previousPath: string
}

const ReportSelectionPage: NextPage<Props> = ({ user, previousPath /*csrfToken*/ }: Props) => {
  const [currentUserContext] = useState<CurrentUserContextType>({ currentUser: user })
  //const [remainingFeedbackLength, setRemainingFeedbackLength] = useState(100)
  const router = useRouter()

  return (
    <CurrentUserContext.Provider value={currentUserContext}>
      <Head>
        <title>{"Bichard7 | Select a report"}</title>
        <meta name="description" content="Bichard7 | Report selection" />
      </Head>
      <a className="govuk-back-link" href={`${router.basePath}` + previousPath} onClick={function noRefCheck() {}}>
        {"Back"}
      </a>
      <Layout
        bichardSwitch={{
          display: true,
          href: `/bichard-ui/ReturnToReportIndex`,
          displaySwitchingSurveyFeedback: true
        }}
      >
        <h1>{"Search reports"}</h1>
        <HeaderWrapper>
          <FormGroup>
            <fieldset className="govuk-fieldset">
              {/*<div id="conditional-resolved-date-range">*/}
              <div>
                <Select placeholder={"Resolved cases"} name={"resolved-cases"}></Select>
                <b>{"Date range"}</b>
                <div id={"report-selection-date-from"}>
                  <DateInput
                    dateType="resolvedFrom"
                    dispatch={function (): void {
                      throw new Error("Function not implemented.")
                    }}
                    value={""}
                    dateRange={undefined} // dispatch={dispatch}
                    // value={caseResolvedDateRange?.from ?? ""}
                    // dateRange={caseResolvedDateRange}
                  />
                </div>
                <div id={"report-selection-date-from"}>
                  <DateInput
                    dateType="resolvedTo"
                    dispatch={function (): void {
                      throw new Error("Function not implemented.")
                    }}
                    value={""}
                    dateRange={undefined} // dispatch={dispatch}
                    // value={caseResolvedDateRange?.to ?? ""}
                    // dateRange={caseResolvedDateRange}
                  />
                </div>
              </div>
            </fieldset>
          </FormGroup>
        </HeaderWrapper>
      </Layout>
    </CurrentUserContext.Provider>
  )
}

export default ReportSelectionPage
