import { EventSubscriber, EntitySubscriberInterface } from "typeorm"
import Note from "../entities/Note"
import { formatUserFullName } from "../../utils/formatUserFullName"

@EventSubscriber()
export class NoteSubscriber implements EntitySubscriberInterface<Note> {
  listenTo() {
    return Note
  }

  async afterLoad(note: Note) {
    if (note.userId && note.user) {
      note.userFullName = formatUserFullName(note.user.forenames, note.user.surname)
    }
  }
}
