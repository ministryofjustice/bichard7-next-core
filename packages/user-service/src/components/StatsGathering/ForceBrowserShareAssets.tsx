/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
interface Props {
  visibleForces: string
  userId: number
}

const ForceBrowserShareAssets = ({ visibleForces, userId }: Props) => {
  const forces = visibleForces.split(",")
  const forcesImgs = forces.map((force: string, i: number) => (
    <img src={`/forces.png?forceID=${force}&userID=${userId}`} className="govuk-!-display-none" key={i} />
  ))
  return <>{forcesImgs}</>
}

export default ForceBrowserShareAssets
