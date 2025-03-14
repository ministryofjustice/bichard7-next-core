import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import errorPaths from "@moj-bichard7/core/lib/exceptions/errorPaths"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"

export default function (aho: AnnotatedHearingOutcome): AnnotatedHearingOutcome {
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber = ""
  aho.Exceptions.push({
    code: ExceptionCode.HO100302,
    path: errorPaths.case.asn,
    message:
      "PNCAM - CONNECTION FAILURE AFTER 3 ATTEMPTS. 2022-10-05 13:08:05.255+0000: BCS10023X: JUPICEXCEPTION CAUGHT IN CREATEPROXYCONNECTION(): DE.SIEMENS.UTM.JUPIC.JUPICCONNECTEXCEPTION: JUPIC CONNECTION PROBLEM: DE.SIEMENS.UTM.JUPIC.JRFC1006CONNECTEXCEPTION: JRFC1006/SOCKET(): SOCKET EXCEPTION FOR [BEANCONNECT:31004] JAVA.NET.CONNECTEXCEPTION: CONNECTION REFUSED (LA[102/T'JUPIC '], RA[BEANCONNECT/31004/T'BCU31004' »FQDN: BICHARD7-NEXT_BEANCONNECT_1.BICHARD7-NEXT_DEFAULT ADDRESS: 172.23.0.3«]) {BE 1006S}, ERROR CODE: JAVA.IO.IOEXCEPTION [EC_IO_EXCEPTION:104], CONNECTIONID: DE.SIEMENS.UTM.JUPIC.JUPIC[6:1664975285254#46191818]"
  })

  return aho
}
