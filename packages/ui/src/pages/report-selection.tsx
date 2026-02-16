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
import { Select } from "../components/Select"
import {
  FieldsBox,
  SectionTitle,
  SecondarySectionTitle,
  SelectReportsBox,
  DateRangeBox,
  CalendarsBox,
  DateFromBox,
  DateToBox,
  ReportsBox,
  IncludeBox,
  CheckboxesBox,
  CheckboxLabel,
  CheckboxUnit,
  BottomActionsBox,
  ClearSearchLinkBox
} from "./report-selection-fields.styles"
import { Button } from "../components/Buttons/Button"

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

  const triggers = "triggers"
  const exceptions = "exceptions"
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
        <HeaderWrapper style={{ paddingTop: "20px", paddingBottom: "20px" }}>
          <fieldset className="govuk-fieldset">
            <FieldsBox>
              <ReportsBox>
                <SectionTitle>
                  <label>{"Reports"}</label>
                </SectionTitle>
                <SecondarySectionTitle>
                  <label>{"Sort by"}</label>
                </SecondarySectionTitle>
                <SelectReportsBox>
                  <Select placeholder={"Resolved cases"} name={"resolved-cases"}></Select>
                </SelectReportsBox>
              </ReportsBox>
              <DateRangeBox>
                <SectionTitle>
                  <label>{"Date range"}</label>
                </SectionTitle>
                <CalendarsBox>
                  <DateFromBox id={"report-selection-date-from"}>
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
                  </DateFromBox>
                  <DateToBox id={"report-selection-date-to"}>
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
                  </DateToBox>
                </CalendarsBox>
              </DateRangeBox>
              <IncludeBox>
                <SectionTitle>
                  <label>{"Include"}</label>
                </SectionTitle>
                <div>
                  <SecondarySectionTitle>
                    <label>{"Select an option"}</label>
                  </SecondarySectionTitle>
                  <CheckboxesBox /*className="govuk-checkboxes" data-module="govuk-checkboxes"*/>
                    <CheckboxUnit className="govuk-checkboxes__item">
                      <input
                        className="govuk-checkboxes__input"
                        id={triggers}
                        type="checkbox"
                        value={"1"}
                        //checked={selectedTriggerIds.includes(trigger.triggerId)}
                        //onChange={setTriggerSelection}
                      ></input>
                      <CheckboxLabel className="govuk-checkboxes__label" htmlFor={triggers}>
                        {"Triggers"}
                      </CheckboxLabel>
                    </CheckboxUnit>
                    <CheckboxUnit className="govuk-checkboxes__item">
                      <input
                        className="govuk-checkboxes__input"
                        id={exceptions}
                        type="checkbox"
                        value={"1"}
                        //checked={selectedTriggerIds.includes(trigger.triggerId)}
                        //onChange={setTriggerSelection}
                      ></input>
                      <CheckboxLabel className="govuk-checkboxes__label" htmlFor={exceptions}>
                        {"Exceptions"}
                      </CheckboxLabel>
                    </CheckboxUnit>
                  </CheckboxesBox>
                </div>
              </IncludeBox>
            </FieldsBox>
          </fieldset>

          <BottomActionsBox>
            {/*<SearchReportsButtonBox>*/}
            <Button
              id={"search"}
              //style={{ margin: "0px", display: "inline-flex", alignItems: "center" }}>
              style={{ margin: 0, flexShrink: 0, width: "max-content", padding: "10px 20px" }}
            >
              {"Search Reports"}
            </Button>
            {/*</SearchReportsButtonBox>*/}
            <ClearSearchLinkBox>
              <a className="govuk-link govuk-link--no-visited-state" href="/bichard?keywords=">
                {"Clear search"}
              </a>
            </ClearSearchLinkBox>
          </BottomActionsBox>
        </HeaderWrapper>
      </Layout>
    </CurrentUserContext.Provider>
  )
}

export default ReportSelectionPage
