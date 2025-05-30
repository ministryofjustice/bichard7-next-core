import { Button } from "components/Buttons/Button"
import { LinkButton } from "components/Buttons/LinkButton"
import ConditionalRender from "components/ConditionalRender"
import { useCourtCase } from "context/CourtCaseContext"
import { useCsrfToken } from "context/CsrfTokenContext"
import { usePreviousPath } from "context/PreviousPathContext"
import { usePathname } from "next/navigation"
import { useRouter } from "next/router"
import { AmendmentKeys } from "types/Amendments"
import type NavigationHandler from "types/NavigationHandler"
import excludeSavedAmendments from "utils/autoSave/excludeSavedAmendments"
import DefaultException from "../../../components/Exception/DefaultException"
import PncException from "../../../components/Exception/PncException"
import Form from "../../../components/Form"
import amendmentsHaveChanged from "../../../utils/amendmentsHaveChanged"
import LockStatusTag from "../LockStatusTag"
import { ButtonContainer, SeparatorLine } from "./ExceptionsList.styles"

interface Props {
  onNavigate: NavigationHandler
  canResolveAndSubmit: boolean
  stopLeavingFn: (newValue: boolean) => void
}

const ExceptionsList = ({ onNavigate, canResolveAndSubmit, stopLeavingFn }: Props) => {
  const { courtCase, amendments, savedAmendments } = useCourtCase()
  const pncExceptions = courtCase.aho.Exceptions.filter((exception) => "message" in exception)
  const otherExceptions = courtCase.aho.Exceptions.filter((exception) => !("message" in exception))
  const { csrfToken } = useCsrfToken()
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
        <DefaultException key={`exception_${index}`} path={path} code={code} onNavigate={onNavigate} />
      ))}

      <ConditionalRender isRendered={canResolveAndSubmit && courtCase.aho.Exceptions.length > 0}>
        <ButtonContainer className={"buttonContainer"}>
          <Form method="post" action={submitCasePath} csrfToken={csrfToken}>
            <input type="hidden" name="amendments" value={JSON.stringify(amendmentsToUpdate)} />
            <Button id="submit" type="submit" disabled={!enableSubmitExceptions} onClick={handleClick}>
              {"Submit exception(s)"}
            </Button>
          </Form>
        </ButtonContainer>
        <ButtonContainer className={"buttonContainer"}>
          <LinkButton href={resolveLink} className="b7-manually-resolve-button" secondary={true} canBeDisabled={true}>
            {"Mark as manually resolved"}
          </LinkButton>
        </ButtonContainer>
      </ConditionalRender>
      <ButtonContainer className={"buttonContainer"}>
        <LockStatusTag
          isRendered={courtCase.aho.Exceptions.length > 0}
          resolutionStatus={courtCase.errorStatus}
          lockName="Exceptions"
        />
      </ButtonContainer>
    </>
  )
}

export default ExceptionsList
