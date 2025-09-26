module.exports = {
  basePath: "/users",
  poweredByHeader: false,
  output: "standalone",
  reactStrictMode: true,
  sassOptions: {
    quietDeps: true
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/users",
        permanent: true,
        basePath: false
      },
      {
        source: "/users/login/v2",
        destination: "/users/login",
        permanent: true,
        basePath: false
      }
    ]
  }
}
