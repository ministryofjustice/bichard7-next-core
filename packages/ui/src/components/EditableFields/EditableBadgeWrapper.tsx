import Badge, { BadgeColours } from "components/Badge"

interface EditableBadgeWrapperProps {
  className: string
  colour: BadgeColours
  label: string
}

const EditableBadgeWrapper: React.FC<EditableBadgeWrapperProps> = ({ className, colour, label }) => {
  return (
    <div className="badge-wrapper">
      <Badge className={`error-badge ${className}`} colour={colour} isRendered={true} label={label} />
    </div>
  )
}

export default EditableBadgeWrapper
