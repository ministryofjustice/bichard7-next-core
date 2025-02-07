interface Props {
  isRendered: boolean
  children: React.ReactNode
}

const ConditionalRender = ({ isRendered, children }: Props) => {
  if (isRendered) {
    return <>{children}</>
  }

  return null
}

export default ConditionalRender
