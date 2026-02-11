export type Sub = {
  courtCode: string
  hearingDate: string
  hearingType: string
}

const convertSub = (subValue: string): Sub => {
  const slice = (start: number, end: number) => subValue.substring(start, end)

  return {
    courtCode: slice(1, 76),
    hearingDate: slice(76, 84),
    hearingType: slice(84, 85)
  }
}

export default convertSub
