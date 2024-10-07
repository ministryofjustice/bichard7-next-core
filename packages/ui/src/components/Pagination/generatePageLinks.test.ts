import { generatePageLinks } from "./generatePageLinks"

describe.each([
  [0, 0, []],
  [1, 1, []],
  [1, 2, [{ label: 1 }, { label: 2, destinationPage: 2 }, { label: "Next", destinationPage: 2 }]],
  [2, 2, [{ label: "Previous", destinationPage: 1 }, { label: 1, destinationPage: 1 }, { label: 2 }]],
  [
    1,
    5,
    [
      { label: 1 },
      { label: 2, destinationPage: 2 },
      { label: "Ellipsis" },
      { label: 5, destinationPage: 5 },
      { label: "Next", destinationPage: 2 }
    ]
  ],
  [
    2,
    5,
    [
      { label: "Previous", destinationPage: 1 },
      { label: 1, destinationPage: 1 },
      { label: 2 },
      { label: 3, destinationPage: 3 },
      { label: "Ellipsis" },
      { label: 5, destinationPage: 5 },
      { label: "Next", destinationPage: 3 }
    ]
  ],
  [
    3,
    5,
    [
      { label: "Previous", destinationPage: 2 },
      { label: 1, destinationPage: 1 },
      { label: 2, destinationPage: 2 },
      { label: 3 },
      { label: 4, destinationPage: 4 },
      { label: 5, destinationPage: 5 },
      { label: "Next", destinationPage: 4 }
    ]
  ],
  [
    7,
    9,
    [
      { label: "Previous", destinationPage: 6 },
      { label: 1, destinationPage: 1 },
      { label: "Ellipsis" },
      { label: 6, destinationPage: 6 },
      { label: 7 },
      { label: 8, destinationPage: 8 },
      { label: 9, destinationPage: 9 },
      { label: "Next", destinationPage: 8 }
    ]
  ],
  [
    6,
    9,
    [
      { label: "Previous", destinationPage: 5 },
      { label: 1, destinationPage: 1 },
      { label: "Ellipsis" },
      { label: 5, destinationPage: 5 },
      { label: 6 },
      { label: 7, destinationPage: 7 },
      { label: "Ellipsis" },
      { label: 9, destinationPage: 9 },
      { label: "Next", destinationPage: 7 }
    ]
  ]
])("generatePageLabels(%i, %i)", (currentPage, totalPages, expected) => {
  test("returns correct labels", () => {
    expect(generatePageLinks(currentPage, totalPages)).toStrictEqual(expected)
  })
})
