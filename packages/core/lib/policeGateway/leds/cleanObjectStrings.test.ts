import cleanObjectStrings from "./cleanObjectStrings"

describe("cleanObjectStrings Exhaustive Tests", () => {
  const WELSH_INPUT = "ÁÀÂÄàáâäÈÉÊËèéêëÌÍÎÏìíîïÒÓÔÖòóôöÙÚÛÜùúûüŴŵẄẅẀẁẂẃỲỳÝýŶŷŸÿ"
  const WELSH_EXPECTED = "AAAAaaaaEEEEeeeeIIIIiiiiOOOOooooUUUUuuuuWwWwWwWwYyYyYyYy"
  const PRINTABLE_ASCII =
    " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~"

  const testCases = [
    {
      description: "preserve standard printable ASCII strings",
      input: PRINTABLE_ASCII,
      expected: PRINTABLE_ASCII
    },
    {
      description: "clean a string containing all target Welsh characters",
      input: WELSH_INPUT,
      expected: WELSH_EXPECTED
    },
    {
      description: "replace control characters in strings with spaces",
      input: "First\nSecond\rThird\tFourth",
      expected: "First Second Third Fourth"
    },
    {
      description: 'replace £ with # and other non-ASCII with "?"',
      input: "Price: £50, Symbol: ©",
      expected: "Price: #50, Symbol: ?"
    },
    {
      description: "clean strings within a nested object",
      input: {
        title: "Hâf",
        info: {
          note: "Cost: £10\n",
          tags: ["ŵ", "ê"]
        }
      },
      expected: {
        title: "Haf",
        info: {
          note: "Cost: #10 ",
          tags: ["w", "e"]
        }
      }
    },
    {
      description: "clean strings within an array of objects",
      input: [
        { name: "Dafydd", task: "bŵer" },
        { name: "Siôn", task: "tŷ" }
      ],
      expected: [
        { name: "Dafydd", task: "bwer" },
        { name: "Sion", task: "ty" }
      ]
    },
    {
      description: "ignore non-string primitives",
      input: { count: 42, active: true, data: null },
      expected: { count: 42, active: true, data: null }
    },
    {
      description: "handle mixed complex structures with £, controls, and symbols",
      input: {
        content: "Cost: £5\nMae'r bŵer yn y tŷ!",
        metadata: ["©", 2026]
      },
      expected: {
        content: "Cost: #5 Mae'r bwer yn y ty!",
        metadata: ["?", 2026]
      }
    },
    {
      description: "should not remove new line character from bailConditions",
      input: { bailConditions: "First\nSecond\rThird\tFourth", bailConditions1: "First\nSecond\rThird\tFourth" },
      expected: { bailConditions: "First\nSecond Third Fourth", bailConditions1: "First Second Third Fourth" }
    }
  ]

  test.each(testCases)("$description", ({ input, expected }) => {
    expect(cleanObjectStrings(input)).toEqual(expected)
  })
})
