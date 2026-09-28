const textStyle = {
  // Reset
  reset: "\x1b[0m",

  // Styles
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  italic: "\x1b[3m",
  underline: "\x1b[4m",

  // Standard Foregrounds
  fg: {
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m"
  },

  // Bright / High-Intensity Foregrounds
  bright: {
    red: "\x1b[91m",
    green: "\x1b[92m",
    yellow: "\x1b[93m",
    blue: "\x1b[94m",
    magenta: "\x1b[95m",
    cyan: "\x1b[96m",
    white: "\x1b[97m"
  },

  // Dark Backgrounds (Standard ANSI 40-47)
  bg: {
    black: "\x1b[40m",
    darkRed: "\x1b[41m",
    darkGreen: "\x1b[42m",
    darkYellow: "\x1b[43m",
    darkBlue: "\x1b[44m",
    darkMagenta: "\x1b[45m",
    darkCyan: "\x1b[46m",
    lightGrey: "\x1b[47m"
  },

  // Bright / High-Contrast Backgrounds (ANSI 100-107)
  bgBright: {
    darkGrey: "\x1b[100m",
    red: "\x1b[101m",
    green: "\x1b[102m",
    yellow: "\x1b[103m",
    blue: "\x1b[104m",
    magenta: "\x1b[105m",
    cyan: "\x1b[106m",
    white: "\x1b[107m"
  },

  // 256-Color Palette Dark Backgrounds
  bg256: {
    charcoal: "\x1b[48;5;234m",
    darkSlate: "\x1b[48;5;236m",
    navy: "\x1b[48;5;18m",
    deepPurple: "\x1b[48;5;53m",
    darkOlive: "\x1b[48;5;22m"
  },

  // Custom
  brightWhite: "\x1b[97m",
  boldWhite: "\x1b[1;37m",
  midGrey: "\x1b[38;5;244m",
  lightGrey: "\x1b[38;5;250m",
  default: "\x1b[38;5;250m"
}

export default textStyle
