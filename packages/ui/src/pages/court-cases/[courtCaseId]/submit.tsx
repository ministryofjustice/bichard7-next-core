import Permission from "@moj-bichard7/common/types/Permission"
import Banner from "components/Banner"
import { Button } from "components/Buttons/Button"
import ButtonsGroup from "components/ButtonsGroup"
import ConditionalRender from "components/ConditionalRender"
import Form from "components/Form"
import { HeaderContainer, HeaderRow } from "components/Header/Header.styles"
import Layout from "components/Layout"
import { CurrentUserContext, CurrentUserContextType } from "context/CurrentUserContext"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import { useState } from "react"
import { courtCaseToDisplayFullCourtCaseDto } from "services/dto/courtCaseDto"
import { userToDisplayFullUserDto } from "services/dto/userDto"
import getCourtCaseByOrganisationUnit from "services/getCourtCaseByOrganisationUnit"
import getDataSource from "services/getDataSource"
import { createMqConfig, StompitMqGateway } from "services/mq"
import resubmitCourtCase from "services/resubmitCourtCase"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { isError } from "types/Result"
import { DisplayFullCourtCase } from "types/display/CourtCases"
import { DisplayFullUser } from "types/display/Users"
import amendmentsHaveChanged from "utils/amendmentsHaveChanged"
import { isPost } from "utils/http"
import redirectTo from "utils/redirectTo"
import withCsrf from "../../../middleware/withCsrf/withCsrf"
import CsrfServerSidePropsContext from "../../../types/CsrfServerSidePropsContext"
import forbidden from "../../../utils/forbidden"

const mqGatewayConfig = createMqConfig()
const mqGateway = new StompitMqGateway(mqGatewayConfig)

const hasAmendments = (amendments: string | undefined): boolean =>
  !!amendments && Object.keys(JSON.parse(amendments ?? "{}")).length > 0

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query, req, res, csrfToken, formData } = context as AuthenticationServerSidePropsContext &
      CsrfServerSidePropsContext

    const { confirm } = query
    const { courtCaseId, previousPath } = query as {
      courtCaseId: string
      previousPath: string
    }
    const dataSource = await getDataSource()
    const courtCase = await getCourtCaseByOrganisationUnit(dataSource, +courtCaseId, currentUser)

    if (!courtCase) {
      return {
        notFound: true
      }
    }

    if (isError(courtCase)) {
      console.error(courtCase)
      throw courtCase
    }

    if (!courtCase.canResolveOrSubmit(currentUser)) {
      return forbidden(res)
    }

    const props: Props = {
      csrfToken,
      previousPath: previousPath ?? null,
      user: userToDisplayFullUserDto(currentUser),
      courtCase: courtCaseToDisplayFullCourtCaseDto(courtCase, currentUser),
      amendments: "{}"
    }

    if (isPost(req)) {
      const { amendments } = formData as { amendments: string }
      props.amendments = amendments

      return { props }
    } else {
      redirectTo(previousPath ?? `/court-cases/${courtCase.errorId}`)
    }

    if (isPost(req) && confirm) {
      const { amendments } = formData as { amendments: string }

      const resubmitCourtCaseResult = await resubmitCourtCase(
        dataSource,
        mqGateway,
        JSON.parse(amendments),
        +courtCaseId,
        currentUser
      )

      if (isError(resubmitCourtCaseResult)) {
        throw resubmitCourtCaseResult
      }

      let redirectUrl = `/court-cases/${courtCase.errorId}`

      if (previousPath) {
        redirectUrl += `?previousPath=${encodeURIComponent(previousPath)}`
      }

      if (!currentUser.hasAccessTo[Permission.Triggers] || courtCase.triggerStatus !== "Unresolved") {
        return redirectTo("/")
      }
      return redirectTo(redirectUrl)
    }
    return { props }
  }
)
interface Props {
  user: DisplayFullUser
  courtCase: DisplayFullCourtCase
  csrfToken: string
  previousPath: string | null
  amendments?: string
}
const SubmitCourtCasePage: NextPage<Props> = ({ courtCase, user, previousPath, amendments, csrfToken }: Props) => {
  const { basePath } = useRouter()
  const [currentUserContext] = useState<CurrentUserContextType>({ currentUser: user })

  let backLink = `/court-cases/${courtCase.errorId}`
  if (previousPath) {
    backLink += `?previousPath=${encodeURIComponent(previousPath)}`
  }
  const resubmitCasePath = `${basePath}/court-cases/${courtCase.errorId}?resubmitCase=true`
  const validAmendments = amendmentsHaveChanged(courtCase, JSON.parse(amendments ?? "{}"))
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    setIsSubmitting(true)
  }

  return (
    <CurrentUserContext.Provider value={currentUserContext}>
      <Layout>
        <Head>
          <title>{"Bichard7 | Submit Case Exception(s)"}</title>
          <meta name="description" content="Bichard7 | Submit Case Exception(s)" />
        </Head>
        <a className="govuk-back-link" href={`${basePath}${backLink}`} onClick={function noRefCheck() {}}>
          {"Case Details"}
        </a>
        <HeaderContainer id="header-container">
          <HeaderRow>
            <h1 className="govuk-heading-l" aria-label="Submit Exception(s)">
              {"Submit Exception(s)"}
            </h1>
          </HeaderRow>
        </HeaderContainer>

        <ConditionalRender isRendered={hasAmendments(amendments) || validAmendments}>
          <p className="govuk-body">
            {"Are you sure you want to submit the amended details to the PNC and mark the exception(s) as resolved?"}
          </p>
        </ConditionalRender>

        <ConditionalRender isRendered={!hasAmendments(amendments) && !validAmendments}>
          <Banner message="The case exception(s) have not been updated within Bichard." />
          <p className="govuk-body" data-testid="example-test-id">
            {"Do you want to submit case details to the PNC and mark the exception(s) as resolved?"}
          </p>
        </ConditionalRender>
        <Form onSubmit={handleSubmit} action={resubmitCasePath} method="post" csrfToken={csrfToken}>
          <input type="hidden" name="amendments" value={amendments} />
          <ButtonsGroup>
            <Button id="confirm-submit" type="submit" disabled={isSubmitting}>
              {"Submit exception(s)"}
            </Button>
            <Link className="govuk-link" href={backLink}>
              {"Cancel"}
            </Link>
          </ButtonsGroup>
        </Form>
      </Layout>
    </CurrentUserContext.Provider>
  )
}
export default SubmitCourtCasePage
