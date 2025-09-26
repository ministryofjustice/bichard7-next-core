const isValidUsername = (username: string): boolean => {
  const result: string[] | null = username.match(/^[a-z0-9][a-z0-9-_.]*[a-z0-9]$/i)
  return result !== null
}

export default isValidUsername
