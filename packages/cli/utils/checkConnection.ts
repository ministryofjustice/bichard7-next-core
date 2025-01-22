export async function checkConnection(url: string | URL, timeout = 5000) {
  const { ok } = await fetch(url, {
    signal: AbortSignal.timeout(timeout)
  })

  return ok
}
