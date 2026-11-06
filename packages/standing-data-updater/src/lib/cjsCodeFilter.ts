export default (cjsCode: string | null): boolean =>
  cjsCode != null && /^(?=.*[A-Za-z].*)(?=.*[0-9].*)[A-Za-z0-9]{4,8}$/.test(cjsCode.trim())
