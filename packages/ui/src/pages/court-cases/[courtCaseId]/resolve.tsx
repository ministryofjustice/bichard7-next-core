import Permission from "@moj-bichard7/common/types/Permission"
import { Button } from "components/Buttons/Button"
import ButtonsGroup from "components/ButtonsGroup"
import ConditionalRender from "components/ConditionalRender"
import { HeaderContainer, HeaderRow } from "components/Header/Header.styles"
import Layout from "components/Layout"
import { NoteTextArea } from "components/NoteTextArea"
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
import resolveCourtCase from "services/resolveCourtCase"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { ResolutionReasonKey, ResolutionReasons } from "types/ManualResolution"
import { isError } from "types/Result"
import { DisplayFullCourtCase } from "types/display/CourtCases"
import { DisplayFullUser } from "types/display/Users"
import { isPost } from "utils/http"
import redirectTo from "utils/redirectTo"
import { validateManualResolution } from "utils/validators/validateManualResolution"
import Form from "../../../components/Form"
import withCsrf from "../../../middleware/withCsrf/withCsrf"
import CsrfServerSidePropsContext from "../../../types/CsrfServerSidePropsContext"
import forbidden from "../../../utils/forbidden"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query, req, res, csrfToken, formData } = context as AuthenticationServerSidePropsContext &
      CsrfServerSidePropsContext
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
      lockedByAnotherUser: courtCase.isLockedByAnotherUser(currentUser.username)
    }

    if (isPost(req)) {
      const { reason, reasonText } = formData as { reason: string; reasonText: string }
      const validation = validateManualResolution({ reason: reason as ResolutionReasonKey, reasonText })

      if (validation.error) {
        return {
          props: {
            ...props,
            reasonTextError: validation.error,
            selectedReason: reason as ResolutionReasonKey
          }
        }
      }

      const result = await resolveCourtCase(
        dataSource,
        courtCase,
        { reason: reason as ResolutionReasonKey, reasonText: reasonText ?? "" },
        currentUser
      )

      if (isError(result)) {
        throw result
      }

      let redirectUrl = `/court-cases/${courtCase.errorId}`

      if (previousPath) {
        redirectUrl += `?previousPath=${encodeURIComponent(previousPath)}`
      }

      if (!currentUser.hasAccessTo[Permission.Triggers] || courtCase.triggerStatus !== "Unresolved") {
        return redirectTo("/")
      } else {
        return redirectTo(redirectUrl)
      }
    }

    return { props }
  }
)

interface Props {
  user: DisplayFullUser
  courtCase: DisplayFullCourtCase
  lockedByAnotherUser: boolean
  reasonTextError?: string
  selectedReason?: ResolutionReasonKey
  csrfToken: string
  previousPath: string | null
}

const ResolveCourtCasePage: NextPage<Props> = ({
  courtCase,
  user,
  lockedByAnotherUser,
  selectedReason,
  reasonTextError,
  csrfToken,
  previousPath
}: Props) => {
  const { basePath } = useRouter()
  const [currentUserContext] = useState<CurrentUserContextType>({ currentUser: user })
  const [isSubmitting, setIsSubmitting] = useState(false)

  let backLink = `/court-cases/${courtCase.errorId}`

  if (previousPath) {
    backLink += `?previousPath=${encodeURIComponent(previousPath)}`
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
  }

  return (
    <CurrentUserContext.Provider value={currentUserContext}>
      <Layout>
        <Head>
          <title>{"Bichard7 | Resolve Case"}</title>
          <meta name="description" content="Bichard7 | Resolve Case" />
        </Head>
        <a className="govuk-back-link" href={`${basePath}${backLink}`} onClick={function noRefCheck() {}}>
          {"Case Details"}
        </a>
        <HeaderContainer id="header-container">
          <HeaderRow>
            <h1 className="govuk-heading-l" aria-label="Resolve Case">
              {"Resolve Case"}
            </h1>
          </HeaderRow>
        </HeaderContainer>
        <ConditionalRender isRendered={lockedByAnotherUser}>{"Case is locked by another user."}</ConditionalRender>
        <ConditionalRender isRendered={!lockedByAnotherUser}>
          <Form method="POST" action="#" csrfToken={csrfToken} onSubmit={handleSubmit}>
            <fieldset className="govuk-fieldset">
              <div className={"govuk-form-group"}>
                <label className={`govuk-label govuk-label--m`}>{"Select a reason"}</label>
                <select className="govuk-select" name="reason">
                  {Object.keys(ResolutionReasons).map((reason) => {
                    return (
                      <option selected={selectedReason === reason} key={reason} value={reason}>
                        {ResolutionReasons[reason as ResolutionReasonKey]}
                      </option>
                    )
                  })}
                </select>
              </div>

              <NoteTextArea
                labelText={"Resolution Details"}
                name={"reasonText"}
                errorMessage={reasonTextError}
                showError={!!reasonTextError}
              />

              <ButtonsGroup>
                <Button id="Resolve" type="submit" disabled={isSubmitting}>
                  {"Resolve"}
                </Button>
                <Link href={backLink} className="govuk-link">
                  {"Cancel"}
                </Link>
              </ButtonsGroup>
            </fieldset>
          </Form>
        </ConditionalRender>
      </Layout>
    </CurrentUserContext.Provider>
  )
}

export default ResolveCourtCasePage
