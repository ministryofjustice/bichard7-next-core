function getDate(daysInPast) {
  const x = new Date()
  x.setDate(x.getDate() - daysInPast)
  return x
}

const serviceMessages = [
  {
    message: "Message 1",
    created_at: getDate(270),
    incident_date: null
  },
  {
    message: "Message 2",
    created_at: getDate(180),
    incident_date: null
  },
  {
    message: "Message 3",
    created_at: getDate(90),
    incident_date: null
  },
  {
    message: "Message 4",
    created_at: getDate(60),
    incident_date: null
  },
  {
    message: "Message 5",
    created_at: getDate(35),
    incident_date: null
  },
  {
    message: "Message 6",
    created_at: getDate(31),
    incident_date: null
  },
  {
    message: "Message 7",
    created_at: getDate(27),
    incident_date: null
  },
  {
    message: "Message 8",
    created_at: getDate(25),
    incident_date: null
  },
  {
    message: "Message 9",
    created_at: getDate(20),
    incident_date: null
  },
  {
    message: "Message 10",
    created_at: getDate(15),
    incident_date: null
  },
  {
    message: "Message 11",
    created_at: getDate(10),
    incident_date: null
  },
  {
    message: "Message 12",
    created_at: getDate(5),
    incident_date: null
  },
  {
    message: "Message 13",
    created_at: new Date(),
    incident_date: null
  }
]

export default serviceMessages
