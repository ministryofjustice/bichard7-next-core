import AutoSave from "components/EditableFields/AutoSave"
import { useCourtCase } from "context/CourtCaseContext"
import { useCallback, useEffect, useState } from "react"
import offenceAlreadySelected from "utils/offenceMatcher/offenceAlreadySelected"
import offenceMatcherSelectValue from "utils/offenceMatcher/offenceMatcherSelectValue"

import type { Candidates } from "../../../../../../types/OffenceMatching"

import Badge, { BadgeColours } from "../../../../../../components/Badge"

interface Props {
  candidates?: Candidates[]
  isCaseLockedToCurrentUser: boolean
  offenceIndex: number
}

const OffenceMatcher = ({ candidates, isCaseLockedToCurrentUser, offenceIndex }: Props) => {
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
                      data-ccr={c.courtCaseReference}
                      disabled={offenceAlreadySelected(
                        amendments,
                        offenceIndex,
                        pnc.offence.sequenceNumber,
                        c.courtCaseReference
                      )}
                      key={`${index}-${pnc.offence.cjsOffenceCode}`}
                      value={offenceMatcherSelectValue(pnc.offence.sequenceNumber, c.courtCaseReference)}
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
          amendmentFields={["offenceReasonSequence", "offenceCourtCaseReferenceNumber"]}
          isChanged={offenceMatcherChanged}
          isSaved={offenceMatcherSaved}
          isValid={true}
          key={selectedValue}
          setChanged={setOffenceMatcherChanged}
          setSaved={setOffenceMatcherSaved}
        />
      </>
    )
  } else {
    return <Badge className="moj-badge--large" colour={BadgeColours.Purple} isRendered={true} label={"Unmatched"} />
  }
}

export default OffenceMatcher
