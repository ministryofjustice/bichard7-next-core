const webpack = require("webpack")

/** @type {import('next').NextConfig} */
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
  },
  typescript: {
    tsconfigPath: "./tsconfig.build.json"
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      const emptyJSONPath = require.resolve("./empty.json")

      const jsonFiles = [
        "offence-code",
        "organisation-unit",
        "crest-disposal",
        "result-code",
        "result-qualifier-code",
        "country",
        "pnc-disposal"
      ]

      jsonFiles.forEach((file) =>
        config.plugins.push(new webpack.NormalModuleReplacementPlugin(new RegExp(`${file}.json`), emptyJSONPath))
      )
    }

    return config
  }
}

module.exports = nextConfig
