const dummyAsnPatterns = [
  "0800(N|P)P01[0-9]{11}[A-HJ-NP-RT-Z]{1}",
  "[0-9]{4}NRPR[0-9A-Z]{12}",
  "[0-9]{2}12LN00[0-9]{11}[A-HJ-NP-RT-Z]{1}",
  "[0-9]{2}00NP00[0-9]{11}[A-HJ-NP-RT-Z]{1}",
  "[0-9]{2}6300[0-9]{13}[A-HJ-NP-RT-Z]{1}",
  "[0-9]{2}06SS[0-9A-Z]{2}[0-9]{11}[A-HJ-NP-RT-Z]{1}",
  "[0-9]{2}00XX[0-9A-Z]{2}[0-9]{11}[A-HJ-NP-RT-Z]{1}",
  "[0-9]{2}50(11|12|21|41|42|43|OF)[0-9A-Z]{2}[0-9]{11}[A-HJ-NP-RT-Z]{1}",
  "[0-9]{2}50(11|12|21|41|42|43|OF|SJ)[0-9A-Z]{2}[0-9]{11}[A-HJ-NP-RT-Z]{1}"
]

const isDummyAsn = (data: string): boolean => dummyAsnPatterns.some((p) => data.match(p))

export default isDummyAsn
