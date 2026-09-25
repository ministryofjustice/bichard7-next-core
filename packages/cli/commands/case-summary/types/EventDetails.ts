type EventDetails = {
  type: "Query" | "Add disposal results" | "Remand" | "Subsequently varied" | "Sentence deferred" | "Penalty hearing"
  content: object
}

export default EventDetails
