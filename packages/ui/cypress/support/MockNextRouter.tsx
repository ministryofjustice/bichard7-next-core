import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime"
import { NextRouter } from "next/router"
import { FC, ReactNode, useMemo } from "react"
import { createMockRouter } from "../../test/helpers/createMockRouter"

interface MockRouterProps extends Partial<NextRouter> {
  children: ReactNode
}

// When you use MockNextRouter pass in cy.stub() on things you want to
// listen to/mock out
export const MockNextRouter: FC<MockRouterProps> = ({ children, ...routerProps }) => {
  const router = useMemo(() => {
    return { ...createMockRouter(), ...routerProps }
  }, [routerProps])

  return <RouterContext.Provider value={router}>{children}</RouterContext.Provider>
}
