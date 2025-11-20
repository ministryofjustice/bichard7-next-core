export type Dis = {
  updateType: string
  type: string
  qtyDuration: string
  qtyDate: string
  qtyMonetaryValue: string
  qtyUnitsFined: string
  qualifiers: string
  text: string
}

const convertDis = (disValue: string): Dis => {
  const slice = (start: number, end: number) => disValue.substring(start, end).trim()

  return {
    updateType: slice(0, 1),
    type: slice(1, 5),
    qtyDuration: slice(5, 9),
    qtyDate: slice(9, 17),
    qtyMonetaryValue: slice(17, 27),
    qtyUnitsFined: slice(27, 29),
    qualifiers: slice(29, 41),
    text: slice(41, 105)
  }
}

export default convertDis
