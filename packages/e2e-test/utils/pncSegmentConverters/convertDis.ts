const convertDis = (disValue: string) => ({
  intfcUpdateType: disValue.substring(0, 1),
  type: disValue.substring(1, 5),
  qtyDuration: disValue.substring(5, 9),
  qtyDate: disValue.substring(9, 17),
  qtyMonetaryValue: disValue.substring(17, 27),
  qtyUnitsFined: disValue.substring(27, 29),
  qualifiers: disValue.substring(29, 41),
  text: disValue.substring(41, 105)
})

export default convertDis
