export const convertDate = (date: string) => {
  const dayOfMonth = date.substring(0, 2)
  const month = date.substring(2, 4)
  const year = date.substring(4, 8)

  return `${year}-${month}-${dayOfMonth}`
}

export const convertTime = (time: string) => {
  const hour = time.substring(0, 2)
  const minute = time.substring(2, 4)

  return `${hour}:${minute}+00:00`
}
