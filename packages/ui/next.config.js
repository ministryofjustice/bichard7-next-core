const nextConfig = {
  basePath: "/bichard",
  assetPrefix: "/bichard/",
  reactStrictMode: true,
  transpilePackages: ["hex-rgb", "is-plain-obj"],
  output: "standalone",
  poweredByHeader: false,
  async rewrites() {
    return [
      {
        source: "/bichard/help/",
        destination: "/help/"
      },
      {
        source: "/bichard/bichard-ui/ReturnToReportIndex",
        destination: "/bichard-ui/ReturnToReportIndex"
      },
      {
        source: "/bichard/users/users/",
        destination: "/users/users/"
      }
    ]
  },
  compiler: {
    styledComponents: true
  }
}

module.exports = nextConfig
