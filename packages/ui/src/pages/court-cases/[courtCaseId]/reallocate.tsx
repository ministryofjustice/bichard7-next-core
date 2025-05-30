import ActionLink from "components/ActionLink"
import ConditionalRender from "components/ConditionalRender"
import { HeaderContainer, HeaderRow } from "components/Header/Header.styles"
import Layout from "components/Layout"
import { NotesTable } from "components/NotesTable"
import ReallocationNotesForm from "components/ReallocationNotesForm"
import { CourtCaseContext, useCourtCaseContextState } from "context/CourtCaseContext"
import { CsrfTokenContext, useCsrfTokenContextState } from "context/CsrfTokenContext"
import { CurrentUserContext } from "context/CurrentUserContext"
import { PreviousPathContext } from "context/PreviousPathContext"
import Header from "features/CourtCaseDetails/Header"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import { useState } from "react"
import { courtCaseToDisplayFullCourtCaseDto } from "services/dto/courtCaseDto"
import { userToDisplayFullUserDto } from "services/dto/userDto"
import getCourtCaseByOrganisationUnit from "services/getCourtCaseByOrganisationUnit"
import getDataSource from "services/getDataSource"
import reallocateCourtCase from "services/reallocateCourtCase"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { isError } from "types/Result"
import { DisplayFullCourtCase } from "types/display/CourtCases"
import { DisplayNote } from "types/display/Notes"
import { DisplayFullUser } from "types/display/Users"
import forbidden from "utils/forbidden"
import { isPost } from "utils/http"
import redirectTo from "utils/redirectTo"
import withCsrf from "../../../middleware/withCsrf/withCsrf"
import {
  NotesTableContainer,
  ReallocationContainer,
  ShowMoreContainer,
  UserNotesContainer
} from "../../../styles/reallocate.styles"
import CsrfServerSidePropsContext from "../../../types/CsrfServerSidePropsContext"

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

    if (!courtCase.canReallocate(currentUser.username)) {
      return forbidden(res)
    }

    const props = {
      csrfToken,
      previousPath: previousPath || "",
      user: userToDisplayFullUserDto(currentUser),
      courtCase: courtCaseToDisplayFullCourtCaseDto(courtCase, currentUser),
      lockedByAnotherUser: courtCase.isLockedByAnotherUser(currentUser.username),
      canReallocate: courtCase.canReallocate(currentUser.username)
    }

    if (isPost(req)) {
      const { force, note } = formData as { force: string; note?: string }
      const reallocateResult = await reallocateCourtCase(dataSource, courtCase.errorId, currentUser, force, note)

      if (isError(reallocateResult)) {
        throw reallocateResult
      } else {
        return redirectTo("/")
      }
    }

    return { props }
  }
)

interface Props {
  user: DisplayFullUser
  courtCase: DisplayFullCourtCase
  lockedByAnotherUser: boolean
  csrfToken: string
  previousPath: string
  canReallocate: boolean
}

const ReallocateCasePage: NextPage<Props> = ({
  courtCase,
  user,
  lockedByAnotherUser,
  csrfToken,
  previousPath,
  canReallocate
}: Props) => {
  const [showMore, setShowMore] = useState<boolean>(false)
  const courtCaseContext = useCourtCaseContextState(courtCase)
  const csrfTokenContext = useCsrfTokenContextState(csrfToken)

  const notes: DisplayNote[] = courtCase.notes

  let backLink = `/court-cases/${courtCase.errorId}`

  if (previousPath) {
    backLink += `?previousPath=${encodeURIComponent(previousPath)}`
  }

  const userNotes = notes
    .filter(({ userId }) => userId !== "System")
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .reverse()

  return (
    <>
      <Head>
        <title>{"Bichard7 | Case Reallocation"}</title>
        <meta name="description" content="Bichard7 | Case Reallocation" />
      </Head>
      <CurrentUserContext.Provider value={{ currentUser: user }}>
        <CourtCaseContext.Provider value={courtCaseContext}>
          <CsrfTokenContext.Provider value={csrfTokenContext}>
            <PreviousPathContext.Provider value={{ previousPath }}>
              <Layout>
                <HeaderContainer id="header-container">
                  <Header canReallocate={canReallocate} />

                  <HeaderRow>
                    <h2 className="govuk-heading-m" aria-label="Reallocate Case">
                      {"Case reallocation"}
                    </h2>
                  </HeaderRow>
                </HeaderContainer>
                <ConditionalRender isRendered={lockedByAnotherUser}>
                  {"Case is locked by another user."}
                </ConditionalRender>
                <ConditionalRender isRendered={!lockedByAnotherUser}>
                  <div className="govuk-grid-row">
                    <ReallocationContainer className={`govuk-grid-column-full`}>
                      <ReallocationNotesForm backLink={backLink} />
                    </ReallocationContainer>
                    <UserNotesContainer className={`govuk-grid-column-full`}>
                      <h2 className="govuk-heading-s">{"Previous User Notes"}</h2>
                      {userNotes.length > 0 ? (
                        <>
                          <NotesTableContainer className={"notes-table-container"}>
                            <NotesTable displayForce notes={showMore ? userNotes : userNotes.slice(0, 1)} />
                          </NotesTableContainer>
                          <ShowMoreContainer className={"govuk-grid-row show-more-container"}>
                            <ActionLink
                              onClick={() => setShowMore(!showMore)}
                              id={showMore ? "show-more-action" : "show-less-action"}
                            >
                              {showMore ? "show less" : "show more"}
                            </ActionLink>
                          </ShowMoreContainer>
                        </>
                      ) : (
                        <p className={"govuk-body"}>{"Case has no user notes."}</p>
                      )}
                    </UserNotesContainer>
                  </div>
                </ConditionalRender>
              </Layout>
            </PreviousPathContext.Provider>
          </CsrfTokenContext.Provider>
        </CourtCaseContext.Provider>
      </CurrentUserContext.Provider>
    </>
  )
}

export default ReallocateCasePage
