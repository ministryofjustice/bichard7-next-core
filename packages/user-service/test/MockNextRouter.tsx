import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime"
import { NextRouter } from "next/router"
import { FC, ReactNode, useMemo } from "react"

interface MockRouterProps extends Partial<NextRouter> {
  children: ReactNode
}

const defaultRouter: NextRouter = {
  basePath: "",
  pathname: "/",
  route: "/",
  query: {},
  asPath: "/",
  push: () => Promise.resolve(true),
  replace: () => Promise.resolve(true),
  reload: () => {},
  back: () => {},
  forward: () => {},
  prefetch: () => Promise.resolve(),
  beforePopState: () => {},
  events: {
    on: () => {},
    off: () => {},
    emit: () => {}
  },
  isFallback: false,
  isLocaleDomain: false,
  isReady: true,
  isPreview: false
}

// When you use MockNextRouter pass in cy.stub() on things you want to
// listen to/mock out
export const MockNextRouter: FC<MockRouterProps> = ({ children, ...routerProps }) => {
  const router = useMemo(() => {
    return { ...defaultRouter, ...routerProps }
  }, [routerProps])

  return <RouterContext.Provider value={router}>{children}</RouterContext.Provider>
}
