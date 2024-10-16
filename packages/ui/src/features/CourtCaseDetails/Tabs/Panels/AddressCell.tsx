import { Address } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import ConditionalRender from "components/ConditionalRender"

interface AddressProps {
  address: Address
}

export const AddressCell = ({
  address: { AddressLine1, AddressLine2, AddressLine3, AddressLine4, AddressLine5 }
}: AddressProps) => (
  <>
    <div>{AddressLine1}</div>
    <ConditionalRender isRendered={typeof AddressLine2 !== "undefined"}>
      <div>{AddressLine2}</div>
    </ConditionalRender>
    <ConditionalRender isRendered={typeof AddressLine3 !== "undefined"}>
      <div>{AddressLine3}</div>
    </ConditionalRender>
    <ConditionalRender isRendered={typeof AddressLine4 !== "undefined"}>
      <div>{AddressLine4}</div>
    </ConditionalRender>
    <ConditionalRender isRendered={typeof AddressLine5 !== "undefined"}>
      <div>{AddressLine5}</div>
    </ConditionalRender>
  </>
)
