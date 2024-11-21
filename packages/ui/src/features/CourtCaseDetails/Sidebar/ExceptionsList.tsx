import ConditionalRender from "components/ConditionalRender"
import LinkButton from "components/LinkButton"
import { useCourtCase } from "context/CourtCaseContext"
import { useCsrfToken } from "context/CsrfTokenContext"
import { usePreviousPath } from "context/PreviousPathContext"
import { Button } from "govuk-react"
import { usePathname } from "next/navigation"
import { useRouter } from "next/router"
import { AmendmentKeys } from "types/Amendments"
import excludeSavedAmendments from "utils/autoSave/excludeSavedAmendments"

import DefaultException from "../../../components/Exception/DefaultException"
import PncException from "../../../components/Exception/PncException"
import Form from "../../../components/Form"
import amendmentsHaveChanged from "../../../utils/amendmentsHaveChanged"
import { gdsLightGrey, gdsMidGrey, textPrimary } from "../../../utils/colours"
import LockStatusTag from "../LockStatusTag"
import { ButtonContainer, SeparatorLine } from "./ExceptionsList.styles"

interface Props {
  canResolveAndSubmit: boolean
  onNavigate: NavigationHandler
  stopLeavingFn: (newValue: boolean) => void
}

const ExceptionsList = ({ onNavigate, canResolveAndSubmit, stopLeavingFn }: Props) => {
  const { courtCase, amendments, savedAmendments } = useCourtCase()
  const pncExceptions = courtCase.aho.Exceptions.filter((exception) => "message" in exception)
  const otherExceptions = courtCase.aho.Exceptions.filter((exception) => !("message" in exception))
  const csrfToken = useCsrfToken()
  const previousPath = usePreviousPath()
  const router = useRouter()
  const enableSubmitExceptions = amendmentsHaveChanged(courtCase, amendments)

  let resolveLink = `${router.basePath}${usePathname()}/resolve`

  if (previousPath) {
    resolveLink += `?previousPath=${encodeURIComponent(previousPath)}`
  }

  const submitCasePath = `${router.basePath}${usePathname()}/submit`

  const handleClick = () => {
    stopLeavingFn(false)
  }

  const amendmentsToUpdate = excludeSavedAmendments(
    Object.keys(amendments) as AmendmentKeys[],
    amendments,
    savedAmendments
  )

  return (
    <>
      {courtCase.aho.Exceptions.length === 0 && "There are no exceptions for this case."}

      {pncExceptions.map(({ code, message }, index) => (
        <PncException key={`exception_${index}`} code={code} message={message} />
      ))}

      {pncExceptions.length > 0 && otherExceptions.length > 0 && <SeparatorLine />}

      {otherExceptions.map(({ code, path }, index) => (
        <DefaultException code={code} key={`exception_${index}`} onNavigate={onNavigate} path={path} />
      ))}

      <ConditionalRender isRendered={canResolveAndSubmit && courtCase.aho.Exceptions.length > 0}>
        <ButtonContainer className={"buttonContainer"}>
          <Form action={submitCasePath} csrfToken={csrfToken} method="post">
            <input name="amendments" type="hidden" value={JSON.stringify(amendmentsToUpdate)} />
            <Button disabled={!enableSubmitExceptions} id="submit" onClick={handleClick} type="submit">
              {"Submit exception(s)"}
            </Button>
          </Form>
        </ButtonContainer>
        <ButtonContainer className={"buttonContainer"}>
          <LinkButton
            buttonColour={gdsLightGrey}
            buttonShadowColour={gdsMidGrey}
            buttonTextColour={textPrimary}
            className="b7-manually-resolve-button"
            href={resolveLink}
          >
            {"Mark as manually resolved"}
          </LinkButton>
        </ButtonContainer>
      </ConditionalRender>
      <ButtonContainer className={"buttonContainer"}>
        <LockStatusTag
          isRendered={courtCase.aho.Exceptions.length > 0}
          lockName="Exceptions"
          resolutionStatus={courtCase.errorStatus}
        />
      </ButtonContainer>
    </>
  )
}

export default ExceptionsList
