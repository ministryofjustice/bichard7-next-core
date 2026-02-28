export type Txt = {
  txt: string
}

const convertTxt = (txtValue: string): Txt => {
  return {
    txt: txtValue
  }
}

export default convertTxt
