export default class PoliceApiError extends Error {
  get messages() {
    return this._messages
  }

  constructor(private _messages: string[]) {
    super(_messages[0])
  }
}
