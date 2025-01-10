class PncUpdateRequestError extends Error {
  get messages() {
    return this._messages
  }

  constructor(private _messages: string[]) {
    super(_messages[0])
  }
}

export default PncUpdateRequestError
