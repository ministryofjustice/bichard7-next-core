import { useRouter } from "next/router"

export interface LinkButtonProps extends React.ComponentProps<"a"> {
  href: string
  secondary?: boolean
  dataModule?: string
}

export const LinkButton: React.FC<LinkButtonProps> = ({
  children,
  href,
  secondary = false,
  dataModule = "govuk-button",
  ...linkButtonProps
}: LinkButtonProps) => {
  const { asPath, basePath } = useRouter()

  const classNames = linkButtonProps.className?.split(" ") ?? []

  if (!classNames.includes("govuk-button")) {
    classNames.push("govuk-button")
  }

  if (secondary) {
    classNames.push("govuk-button--secondary")
  }

  return (
    <a
      {...linkButtonProps}
      href={href.startsWith("/") ? href : `${basePath}${asPath}/${href}`}
      role="button"
      draggable="false"
      className={classNames.join(" ")}
      data-module={dataModule}
    >
      {children}
    </a>
  )
}
