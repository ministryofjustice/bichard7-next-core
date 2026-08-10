import { join } from "path"

const BASE_PATH = "/users"

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: BASE_PATH,
  env: {
    NEXT_PUBLIC_BASE_PATH: BASE_PATH
  },
  poweredByHeader: false,
  output: "standalone",
  reactStrictMode: true,
  sassOptions: {
    quietDeps: true,
    loadPaths: [join(process.cwd())],
    includePaths: ["./styles/**/*.scss"]
  },
  compiler: {
    styledComponents: true
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

export default nextConfig
