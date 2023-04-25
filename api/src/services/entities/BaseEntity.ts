export default class BaseEntity {
  serialize() {
    return JSON.parse(JSON.stringify(this))
  }
}
