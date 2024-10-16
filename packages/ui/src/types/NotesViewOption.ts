const NOTES_VIEW_OPTIONS = ["View all notes", "View user notes", "View system notes"] as const
type NotesViewOption = (typeof NOTES_VIEW_OPTIONS)[number]

export { NOTES_VIEW_OPTIONS }
export default NotesViewOption
