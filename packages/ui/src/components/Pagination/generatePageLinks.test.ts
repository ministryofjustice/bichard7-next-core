import { generatePageLinks } from "./generatePageLinks"

describe.each([
  [0, 0, []],
  [1, 1, []],
  [1, 2, [{ label: 1 }, { destinationPage: 2, label: 2 }, { destinationPage: 2, label: "Next" }]],
  [2, 2, [{ destinationPage: 1, label: "Previous" }, { destinationPage: 1, label: 1 }, { label: 2 }]],
  [
    1,
    5,
    [
      { label: 1 },
      { destinationPage: 2, label: 2 },
      { label: "Ellipsis" },
      { destinationPage: 5, label: 5 },
      { destinationPage: 2, label: "Next" }
    ]
  ],
  [
    2,
    5,
    [
      { destinationPage: 1, label: "Previous" },
      { destinationPage: 1, label: 1 },
      { label: 2 },
      { destinationPage: 3, label: 3 },
      { label: "Ellipsis" },
      { destinationPage: 5, label: 5 },
      { destinationPage: 3, label: "Next" }
    ]
  ],
  [
    3,
    5,
    [
      { destinationPage: 2, label: "Previous" },
      { destinationPage: 1, label: 1 },
      { destinationPage: 2, label: 2 },
      { label: 3 },
      { destinationPage: 4, label: 4 },
      { destinationPage: 5, label: 5 },
      { destinationPage: 4, label: "Next" }
    ]
  ],
  [
    7,
    9,
    [
      { destinationPage: 6, label: "Previous" },
      { destinationPage: 1, label: 1 },
      { label: "Ellipsis" },
      { destinationPage: 6, label: 6 },
      { label: 7 },
      { destinationPage: 8, label: 8 },
      { destinationPage: 9, label: 9 },
      { destinationPage: 8, label: "Next" }
    ]
  ],
  [
    6,
    9,
    [
      { destinationPage: 5, label: "Previous" },
      { destinationPage: 1, label: 1 },
      { label: "Ellipsis" },
      { destinationPage: 5, label: 5 },
      { label: 6 },
      { destinationPage: 7, label: 7 },
      { label: "Ellipsis" },
      { destinationPage: 9, label: 9 },
      { destinationPage: 7, label: "Next" }
    ]
  ]
])("generatePageLabels(%i, %i)", (currentPage, totalPages, expected) => {
  test("returns correct labels", () => {
    expect(generatePageLinks(currentPage, totalPages)).toStrictEqual(expected)
  })
})
