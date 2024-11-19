const nextConfig = {
  assetPrefix: "/bichard/",
  basePath: "/bichard",
  compiler: {
    styledComponents: true
  },
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        destination: "/help/",
        source: "/bichard/help/"
      },
      {
        destination: "/bichard-ui/ReturnToReportIndex",
        source: "/bichard/bichard-ui/ReturnToReportIndex"
      },
      {
        destination: "/users/users/",
        source: "/bichard/users/users/"
      }
    ]
  },
  transpilePackages: ["hex-rgb", "is-plain-obj"],
  typescript: {
    tsconfigPath: "./tsconfig.build.json"
  }
}

module.exports = nextConfig
