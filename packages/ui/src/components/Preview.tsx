import { CustomPreview } from "./Preview.styles"

interface PreviewProps {
  children: React.ReactNode
  id?: string
  className?: string
  ariaHidden?: boolean
}

export const Preview = ({ children, id, className, ariaHidden }: PreviewProps) => {
  if (className) {
    return (
      <div className={className} id={id} aria-hidden={ariaHidden}>
        {children}
      </div>
    )
  }

  return (
    <CustomPreview id={id} aria-hidden={ariaHidden}>
      {children}
    </CustomPreview>
  )
}
