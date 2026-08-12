import { ReactNode } from "react"

interface Props {
  children: ReactNode
  basePath?: boolean
  className?: string
  "data-test"?: string
  href: string
  id?: string
  rel?: string
  title?: string
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
  target?: string
}

const applyBasePath = (href: string): string => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""
  return href.startsWith("/") ? `${basePath}${href}` : href
}

const Link = ({
  children,
  basePath = true,
  className,
  "data-test": dataTest,
  href,
  id,
  rel,
  title,
  onClick,
  target
}: Props) => (
  <a
    data-test={dataTest}
    href={basePath ? applyBasePath(href) : href}
    className={className || "govuk-link"}
    id={id}
    rel={rel}
    title={title}
    onClick={onClick}
    target={target}
  >
    {children}
  </a>
)

export default Link
