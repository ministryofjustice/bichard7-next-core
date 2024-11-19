import { EntitySubscriberInterface, EventSubscriber } from "typeorm"

import { formatUserFullName } from "../../utils/formatUserFullName"
import Note from "../entities/Note"

@EventSubscriber()
export class NoteSubscriber implements EntitySubscriberInterface<Note> {
  async afterLoad(note: Note) {
    if (note.userId && note.user) {
      note.userFullName = formatUserFullName(note.user.forenames, note.user.surname)
    }
  }

  listenTo() {
    return Note
  }
}
