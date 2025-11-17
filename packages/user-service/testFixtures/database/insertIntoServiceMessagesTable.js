import getTestConnection from "../getTestConnection"

const insertIntoServiceMessagesTable = (data) => {
  const connection = getTestConnection()

  const insertQuery = `
    INSERT INTO
      br7own.service_messages(
        message,
        created_at,
        incident_date
      ) VALUES (
        $\{message\},
        $\{created_at\},
        $\{incident_date\}
      )
  `

  return Promise.allSettled(data.map((item) => connection.none(insertQuery, { ...item })))
}

export default insertIntoServiceMessagesTable
