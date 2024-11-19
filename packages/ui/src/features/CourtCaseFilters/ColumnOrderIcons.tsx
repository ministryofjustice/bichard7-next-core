import { ReactNode } from "react"

import { blue } from "../../utils/colours"
import { Content, Icon, IconContainer } from "./ColumnOrderIcons.styles"

interface Props {
  children?: ReactNode
  columnName: string
  currentOrder: string | string[] | undefined
  orderBy: string | string[] | undefined
}

const UpArrow: React.FC = () => {
  return (
    <div className="upArrow">
      <svg fill="none" height={25} viewBox="0 0 15 25" width={15} xmlns="http://www.w3.org/2000/svg">
        <path d="M2 14L7.5 5L13 14H2Z" fill={blue} />
      </svg>
    </div>
  )
}

const DownArrow: React.FC = () => {
  return (
    <div className="downArrow">
      <svg fill="none" height={25} viewBox="0 0 15 25" width={15} xmlns="http://www.w3.org/2000/svg">
        <path d="M13 11L7.5 20L2 11L13 11Z" fill={blue} />
      </svg>
    </div>
  )
}

const Unordered: React.FC = () => {
  return (
    <div className="unorderedArrow">
      <svg fill="none" height={25} viewBox="0 0 15 25" width={15} xmlns="http://www.w3.org/2000/svg">
        <path d="M4 11L7.5 3L11 11H4Z" fill={blue} />
        <path d="M11 13L7.5 21L4 13L11 13Z" fill={blue} />
      </svg>
    </div>
  )
}

const ColumnOrderIcons: React.FC<Props> = ({ children, columnName, currentOrder, orderBy }) => {
  let arrow: JSX.Element | undefined = undefined

  if (orderBy === undefined || orderBy !== columnName) {
    arrow = <Unordered />
  } else if (orderBy === columnName) {
    if (currentOrder === "asc") {
      arrow = <UpArrow />
    } else if (currentOrder === "desc") {
      arrow = <DownArrow />
    }
  }

  if (arrow === undefined) {
    return <></>
  }

  return (
    <IconContainer>
      <Content>{children}</Content>
      <Icon>{arrow}</Icon>
    </IconContainer>
  )
}

export default ColumnOrderIcons
