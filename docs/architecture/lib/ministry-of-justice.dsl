group "HMCTS (HM's Courts and Tribunals Service)" {
  commonPlatform = softwareSystem "Common Platform" {
    tags "Ministry of Justice" "HMCTS"
  }
  libra = softwareSystem "Libra" {
    tags "Ministry of Justice" "HMCTS"
  }
}

group "CJIT (Criminal Justice IT)" {
  cjsm = softwareSystem "CJSM" "Criminal Justice Secure Mail" {
    tags "Ministry of Justice" "CJIT"
  }
}