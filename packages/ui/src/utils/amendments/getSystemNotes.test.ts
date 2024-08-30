import User from "services/entities/User"
import getSystemNotes from "./getSystemNotes"

describe("getSystemNotes", () => {
  const dummyErrorId = 0
  const user = { username: "Some User" } as User

  it("can generate system notes when the amendment values are strings", () => {
    const expectedAmendmentValue = "newValue"
    expect(
      getSystemNotes(
        {
          asn: expectedAmendmentValue,
          courtPNCIdentifier: expectedAmendmentValue
        },
        user,
        dummyErrorId
      )
    ).toStrictEqual([
      {
        errorId: dummyErrorId,
        noteText: `${user.username}: Portal Action: Update Applied. Element: asn. New Value: ${expectedAmendmentValue}`,
        userId: "System"
      },
      {
        errorId: dummyErrorId,
        noteText: `${user.username}: Portal Action: Update Applied. Element: courtPNCIdentifier. New Value: ${expectedAmendmentValue}`,
        userId: "System"
      }
    ])
  })

  it("can generate system notes when the amendment values are UpdatedOffenceValue types", () => {
    expect(
      getSystemNotes(
        {
          offenceReasonSequence: [
            {
              offenceIndex: 0,
              value: 1
            }
          ],
          courtOffenceSequenceNumber: [
            {
              offenceIndex: 0,
              value: 12345
            }
          ],
          resultQualifierCode: [
            {
              offenceIndex: 0,
              value: "newResultQualifierCodeValue",
              resultIndex: 1,
              resultQualifierIndex: 2
            }
          ]
        },
        user,
        dummyErrorId
      )
    ).toStrictEqual([
      {
        errorId: dummyErrorId,
        noteText: `${user.username}: Portal Action: Update Applied. Element: offenceReasonSequence. New Value: 1`,
        userId: "System"
      },
      {
        errorId: dummyErrorId,
        noteText: `${user.username}: Portal Action: Update Applied. Element: courtOffenceSequenceNumber. New Value: 12345`,
        userId: "System"
      },
      {
        errorId: dummyErrorId,
        noteText: `${user.username}: Portal Action: Update Applied. Element: resultQualifierCode. New Value: newResultQualifierCodeValue`,
        userId: "System"
      }
    ])
  })

  it("can generate system notes when the amendment value is UpdatedNextHearingDate type", () => {
    const updatedDate = "2023-01-16"
    expect(
      getSystemNotes(
        {
          nextHearingDate: [
            {
              offenceIndex: 0,
              value: updatedDate,
              resultIndex: 1
            }
          ]
        },
        user,
        dummyErrorId
      )
    ).toStrictEqual([
      {
        errorId: dummyErrorId,
        noteText: `${user.username}: Portal Action: Update Applied. Element: nextHearingDate. New Value: 2023-01-16`,
        userId: "System"
      }
    ])
  })

  it("can not generate system note when the amended key is noUpdatesResubmit", () => {
    expect(getSystemNotes({ noUpdatesResubmit: true }, user, dummyErrorId)).toStrictEqual([])
  })
})
