import Badge, { BadgeColours } from "components/Badge"

interface EditableBadgeWrapperProps {
  colour: BadgeColours
  label: string
  className: string
}

const EditableBadgeWrapper: React.FC<EditableBadgeWrapperProps> = ({ colour, label, className }) => {
  return (
    <div className="badge-wrapper">
      <Badge className={`error-badge ${className}`} isRendered={true} colour={colour} label={label} />
    </div>
  )
}

export default EditableBadgeWrapper
