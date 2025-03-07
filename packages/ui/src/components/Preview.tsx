import { CustomPreview } from "./Preview.styles"

interface PreviewProps {
  children: React.ReactNode
  className?: string
}

export const Preview = ({ children, className }: PreviewProps) => {
  if (className) {
    return <div className={className}>{children}</div>
  }

  return <CustomPreview>{children}</CustomPreview>
}
