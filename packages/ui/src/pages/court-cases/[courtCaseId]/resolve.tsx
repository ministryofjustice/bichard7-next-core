import ButtonsGroup from "components/ButtonsGroup"
import ConditionalRender from "components/ConditionalRender"
import { HeaderContainer, HeaderRow } from "components/Header/Header.styles"
import Layout from "components/Layout"
import { CurrentUserContext, CurrentUserContextType } from "context/CurrentUserContext"
import { BackLink, Button, Fieldset, FormGroup, Heading, Label, Link, Select, TextArea } from "govuk-react"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
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
import Permission from "../../../types/Permission"
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

  let backLink = `${basePath}/court-cases/${courtCase.errorId}`

  if (previousPath) {
    backLink += `?previousPath=${encodeURIComponent(previousPath)}`
  }

  return (
    <>
      <CurrentUserContext.Provider value={currentUserContext}>
        <Layout>
          <Head>
            <title>{"Bichard7 | Resolve Case"}</title>
            <meta name="description" content="Bichard7 | Resolve Case" />
          </Head>
          <BackLink href={backLink} onClick={function noRefCheck() {}}>
            {"Case Details"}
          </BackLink>
          <HeaderContainer id="header-container">
            <HeaderRow>
              <Heading as="h1" size="LARGE" aria-label="Resolve Case">
                {"Resolve Case"}
              </Heading>
            </HeaderRow>
          </HeaderContainer>
          <ConditionalRender isRendered={lockedByAnotherUser}>{"Case is locked by another user."}</ConditionalRender>
          <ConditionalRender isRendered={!lockedByAnotherUser}>
            <Form method="POST" action="#" csrfToken={csrfToken}>
              <Fieldset>
                <FormGroup>
                  <Label>{"Select a reason"}</Label>
                  <Select
                    input={{
                      name: "reason"
                    }}
                    label={""}
                  >
                    {Object.keys(ResolutionReasons).map((reason) => {
                      return (
                        <option selected={selectedReason === reason} key={reason} value={reason}>
                          {ResolutionReasons[reason as ResolutionReasonKey]}
                        </option>
                      )
                    })}
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>{"Resolution Details"}</Label>
                  <TextArea
                    input={{
                      name: "reasonText"
                    }}
                    meta={{
                      error: reasonTextError,
                      touched: !!reasonTextError
                    }}
                  >
                    {""}
                  </TextArea>
                </FormGroup>

                <ButtonsGroup>
                  <Button id="Resolve" type="submit">
                    {"Resolve"}
                  </Button>
                  <Link href={backLink}>{"Cancel"}</Link>
                </ButtonsGroup>
              </Fieldset>
            </Form>
          </ConditionalRender>
        </Layout>
      </CurrentUserContext.Provider>
    </>
  )
}

export default ResolveCourtCasePage
