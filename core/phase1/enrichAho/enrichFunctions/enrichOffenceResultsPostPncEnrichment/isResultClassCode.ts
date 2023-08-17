const resultClassCodes = [
  // eslint-disable-next-line prettier/prettier
  2050, 2063, 4010, 1016, 2053, 2060, 2065, 1029, 1030, 1044, 2006,
  // eslint-disable-next-line prettier/prettier
  3047, 3101, 3102, 3103, 3104, 3105, 3106, 3107, 3108, 3109, 3110,
  // eslint-disable-next-line prettier/prettier
  3111, 3126, 3127, 3128, 3129, 3130, 3131, 3146, 3147, 3148, 3272
]

const isResultClassCode = (code: number | undefined) => resultClassCodes.includes(code ?? 0)

export default isResultClassCode
