import Badge, { BadgeColours } from "components/Badge"
import AutoSave from "components/EditableFields/AutoSave"
import { useCourtCase } from "context/CourtCaseContext"
import { useCallback, useEffect, useState } from "react"
import type { Candidates } from "types/OffenceMatching"
import offenceAlreadySelected from "utils/offenceMatcher/offenceAlreadySelected"
import offenceMatcherSelectValue from "utils/offenceMatcher/offenceMatcherSelectValue"

interface Props {
  offenceIndex: number
  candidates?: Candidates[]
  isCaseLockedToCurrentUser: boolean
}

const OffenceMatcher = ({ offenceIndex, candidates, isCaseLockedToCurrentUser }: Props) => {
  const { amend, amendments } = useCourtCase()

  const findPncOffence = useCallback(() => {
    const offenceReasonSequenceValue =
      amendments.offenceReasonSequence?.find((a) => a.offenceIndex === offenceIndex)?.value ?? ""
    const offenceCourtCaseReferenceNumberValue =
      amendments.offenceCourtCaseReferenceNumber?.find((a) => a.offenceIndex === offenceIndex)?.value ?? ""

    return offenceMatcherSelectValue(offenceReasonSequenceValue, offenceCourtCaseReferenceNumberValue)
  }, [amendments.offenceCourtCaseReferenceNumber, amendments.offenceReasonSequence, offenceIndex])

  const [selectedValue, setSelectedValue] = useState(findPncOffence())
  const [offenceMatcherChanged, setOffenceMatcherChanged] = useState<boolean>(false)
  const [offenceMatcherSaved, setOffenceMatcherSaved] = useState<boolean>(false)

  useEffect(() => {
    setSelectedValue(findPncOffence())
  }, [findPncOffence])

  const onSelectionChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ccr = e.target.options[e.target.selectedIndex].dataset.ccr ?? ""
    const offenceReasonSequence = e.target.value?.replace(/-.*/, "") ?? ""

    amend("offenceReasonSequence")({
      offenceIndex,
      value: Number(offenceReasonSequence)
    })

    amend("offenceCourtCaseReferenceNumber")({
      offenceIndex,
      value: ccr
    })

    setSelectedValue(offenceMatcherSelectValue(offenceReasonSequence, ccr))
    setOffenceMatcherChanged(true)
    setOffenceMatcherSaved(false)
  }

  if (isCaseLockedToCurrentUser) {
    return (
      <>
        <select className="govuk-select offence-matcher" onChange={onSelectionChanged} value={selectedValue}>
          <option disabled hidden value="">
            {"Select an offence"}
          </option>
          {candidates?.map((c) => {
            return (
              <optgroup key={c.courtCaseReference} label={c.courtCaseReference}>
                {c.offences.map((pnc, index) => {
                  return (
                    <option
                      key={`${index}-${pnc.offence.cjsOffenceCode}`}
                      value={offenceMatcherSelectValue(pnc.offence.sequenceNumber, c.courtCaseReference)}
                      disabled={offenceAlreadySelected(
                        amendments,
                        offenceIndex,
                        pnc.offence.sequenceNumber,
                        c.courtCaseReference
                      )}
                      data-ccr={c.courtCaseReference}
                    >
                      {`${String(pnc.offence.sequenceNumber).padStart(3, "0")} - ${pnc.offence.cjsOffenceCode}`}
                    </option>
                  )
                })}
              </optgroup>
            )
          })}
          <option value="0">{"Added in court"}</option>
        </select>
        <AutoSave
          key={selectedValue}
          setChanged={setOffenceMatcherChanged}
          setSaved={setOffenceMatcherSaved}
          isValid={true}
          amendmentFields={["offenceReasonSequence", "offenceCourtCaseReferenceNumber"]}
          isChanged={offenceMatcherChanged}
          isSaved={offenceMatcherSaved}
        />
      </>
    )
  } else {
    return <Badge isRendered={true} colour={BadgeColours.Purple} label={"Unmatched"} className="moj-badge--large" />
  }
}

export default OffenceMatcher
