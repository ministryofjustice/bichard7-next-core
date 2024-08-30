import { createRef } from "react"
import handleAsnForwardSlashes, {
  handleBackwardJumpingForwardSlash,
  handleDeletingFirstCharacter,
  handleForwardJumpingForwardSlash,
  Selection
} from "./handleAsnForwardSlashes"

describe("handleAsnForwardSlashes", () => {
  const asnInputRef = createRef<HTMLInputElement>()

  it("Tracks the movement of the cursor on change", () => {
    const selection: Selection = { start: 4, end: 4 }
    const amendedAsn = "123456"
    const key = ""

    const result = handleAsnForwardSlashes(selection, amendedAsn, key, asnInputRef)

    expect(result).toBe(true)
  })

  it("doesn't do anything whenever selection is undefined", () => {
    const selection = undefined
    const amendedAsn = "123456"
    const key = ""

    const result = handleAsnForwardSlashes(selection, amendedAsn, key, asnInputRef)

    expect(result).toBe(false)
  })

  it("returns true if selection start is 'null'", () => {
    const selection: Selection = { start: null, end: 4 }
    const amendedAsn = "123456"
    const key = ""

    const result = handleAsnForwardSlashes(selection, amendedAsn, key, asnInputRef)

    expect(result).toBe(true)
  })

  it("returns true if selection end is 'null'", () => {
    const selection: Selection = { start: 4, end: null }
    const amendedAsn = "123456"
    const key = ""

    const result = handleAsnForwardSlashes(selection, amendedAsn, key, asnInputRef)

    expect(result).toBe(true)
  })

  describe("#handleFirstCharacter", () => {
    it("Handles if we delete the first character. Stops the cursor from going to the end of the input", () => {
      const selectionStart = 0
      const selectionEnd = 0
      const key = "Backspace"

      const result = handleDeletingFirstCharacter(selectionStart, selectionEnd, key)

      expect(result).toBe(true)
    })

    it("returns false if the isn't 'Backspace'", () => {
      const selectionStart = 0
      const selectionEnd = 0
      const key = ""

      const result = handleDeletingFirstCharacter(selectionStart, selectionEnd, key)

      expect(result).toBe(false)
    })

    it("returns false if the start selection isn't 0", () => {
      const selectionStart = 1
      const selectionEnd = 0
      const key = "Backspace"

      const result = handleDeletingFirstCharacter(selectionStart, selectionEnd, key)

      expect(result).toBe(false)
    })

    it("returns false if the end selection isn't 0", () => {
      const selectionStart = 0
      const selectionEnd = 1
      const key = "Backspace"

      const result = handleDeletingFirstCharacter(selectionStart, selectionEnd, key)

      expect(result).toBe(false)
    })
  })

  describe("#handleForwardJumpingForwardSlash", () => {
    it("returns false when the selection start has a forward slash", () => {
      const amendedAsn = "120"
      const selectionStart = 3
      const key = ""

      const result = handleForwardJumpingForwardSlash(amendedAsn, selectionStart, key)

      expect(result).toBe(false)
    })

    describe("when selection start has a forward slash", () => {
      it("returns true when the key pressed isn't 'Backspace' and doesn't include a disabledKey", () => {
        const amendedAsn = "12"
        const selectionStart = 2
        const key = ""

        const result = handleForwardJumpingForwardSlash(amendedAsn, selectionStart, key)

        expect(result).toBe(true)
      })

      it("returns false when the key pressed is 'Backspace' and doesn't include a disabledKey", () => {
        const amendedAsn = "12"
        const selectionStart = 2
        const key = "Backspace"

        const result = handleForwardJumpingForwardSlash(amendedAsn, selectionStart, key)

        expect(result).toBe(false)
      })

      it("returns true when the key pressed is '' and doesn't include a disabledKey", () => {
        const amendedAsn = "12"
        const selectionStart = 2
        const key = ""

        const result = handleForwardJumpingForwardSlash(amendedAsn, selectionStart, key)

        expect(result).toBe(true)
      })

      it("returns true when the key pressed isn't 'Backspace' and does include a disabledKey", () => {
        const amendedAsn = "12"
        const selectionStart = 2
        const key = "LeftArrow"

        const result = handleForwardJumpingForwardSlash(amendedAsn, selectionStart, key)

        expect(result).toBe(true)
      })
    })
  })

  describe("#handleBackwardJumpingForwardSlash", () => {
    it("returns false when the selection start has a forward slash", () => {
      const amendedAsn = "120"
      const selectionStart = 3
      const key = ""

      const result = handleBackwardJumpingForwardSlash(amendedAsn, selectionStart, key)

      expect(result).toBe(false)
    })

    describe("when selection start - 1 has a forward slash", () => {
      it("returns false when the key pressed isn't 'Backspace' and doesn't include a disabledKey", () => {
        const amendedAsn = "123"
        const selectionStart = 3
        const key = ""

        const result = handleBackwardJumpingForwardSlash(amendedAsn, selectionStart, key)

        expect(result).toBe(false)
      })

      it("returns true when the key pressed is 'Backspace' and doesn't include a disabledKey", () => {
        const amendedAsn = "123"
        const selectionStart = 3
        const key = "Backspace"

        const result = handleBackwardJumpingForwardSlash(amendedAsn, selectionStart, key)

        expect(result).toBe(true)
      })

      it("returns false when the key pressed is '' and doesn't include a disabledKey", () => {
        const amendedAsn = "123"
        const selectionStart = 3
        const key = ""

        const result = handleBackwardJumpingForwardSlash(amendedAsn, selectionStart, key)

        expect(result).toBe(false)
      })

      it("returns false when the key pressed isn't 'Backspace' and does include a disabledKey", () => {
        const amendedAsn = "123"
        const selectionStart = 3
        const key = "LeftArrow"

        const result = handleBackwardJumpingForwardSlash(amendedAsn, selectionStart, key)

        expect(result).toBe(false)
      })
    })
  })
})
