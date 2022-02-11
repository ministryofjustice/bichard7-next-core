import { ResultedCaseMessageParsedXml } from "src/types/IncomingMessage"
import parseMessage from "./parseMessage"
import generateTriggers from "./generateTriggers"
import fs from "fs"
import { TriggerCode } from "src/types/TriggerCode"

const parseFile = (file: string): ResultedCaseMessageParsedXml => {
    const inputMessage = fs.readFileSync(`test-data/${file}`).toString()
    return parseMessage(inputMessage)
}

describe("generateTriggers", () => {
    it("should generate multiple triggers", () => {
        const data = parseFile("input-message-003.xml")
        const result = generateTriggers(data)
        expect(result).toHaveLength(4)
        expect(result).toStrictEqual([
            { code: TriggerCode.TRPR0001, offenceSequenceNumber: 1 },
            { code: TriggerCode.TRPR0001, offenceSequenceNumber: 3 },
            { code: TriggerCode.TRPR0006 },
            { code: TriggerCode.TRPR0012 }
        ])
    })
})
