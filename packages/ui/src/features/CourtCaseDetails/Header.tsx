import { HeaderContainer } from "components/Header/Header.styles"

interface Props {
  canReallocate: boolean
}

const Header: React.FC<Props> = () => {
  return <HeaderContainer id="header-container"></HeaderContainer>
}

export default Header
