import { ResultedCaseMessageParsedXml } from "src/types/IncomingMessage"
import parseMessage from "src/use-cases/parseMessage"
import fs from "fs"
import TRPR0017 from "."
import { TriggerCode } from "src/types/TriggerCode"

const parseFile = (file: string): ResultedCaseMessageParsedXml => {
    const inputMessage = fs.readFileSync(`test-data/${file}`).toString()
    return parseMessage(inputMessage)
}

describe("TRPR0017", () => {
    it("should generate multiple triggers correctly with multiple offences", () => {
        const data = parseFile("input-message-033-1.xml")
        const result = TRPR0017(data)
        expect(result).toHaveLength(3)
        expect(result).toStrictEqual([
            { "code": "TRPR0017", "offenceSequenceNumber": 1 },
            { "code": "TRPR0017", "offenceSequenceNumber": 2 },
            { "code": "TRPR0017", "offenceSequenceNumber": 3 }
        ])
    })

    it("should generate a trigger correctly with single offences", () => {
        const data = parseFile("input-message-033-1-single.xml")
        const result = TRPR0017(data)
        expect(result).toHaveLength(1)
        expect(result).toStrictEqual([
            { code: TriggerCode.TRPR0017, offenceSequenceNumber: 1 }
        ])
    })
    it("should not generate a trigger correctly", () => {
        const data = parseFile("input-message-001.xml")
        const result = TRPR0017(data)
        expect(result).toHaveLength(0)
    })
})
