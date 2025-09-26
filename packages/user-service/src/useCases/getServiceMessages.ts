import config from "lib/config"
import Database from "types/Database"
import PaginatedResult from "types/PaginatedResult"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import ServiceMessage from "types/ServiceMessage"

export default async (connection: Database, page: number): PromiseResult<PaginatedResult<ServiceMessage[]>> => {
  const serviceMessagesQuery = `
  SELECT 
    id, 
    message, 
    created_at AS "createdAt",
    incident_date AS "incidentDate",
    COUNT(*) OVER() AS "allMessages"
  FROM 
    br7own.service_messages
  WHERE
    (incident_date IS NOT NULL AND incident_date BETWEEN DATE(NOW()) AND DATE(NOW()) + INTERVAL '${
      config.serviceMessagesStaleDays + 1
    } days')
    OR
    (incident_date IS NULL AND created_at >= DATE(NOW()) - INTERVAL '${config.serviceMessagesStaleDays} days')
  ORDER BY created_at DESC
    OFFSET ${page * config.maxServiceMessagesPerPage} ROWS
    FETCH NEXT ${config.maxServiceMessagesPerPage} ROWS ONLY
  `

  const serviceMessages = await connection.manyOrNone(serviceMessagesQuery).catch((error) => error as Error)

  if (isError(serviceMessages)) {
    return serviceMessages
  }

  const result = (serviceMessages || []) as ServiceMessage[]
  const totalElements = parseInt(serviceMessages[0]?.allMessages || 0, 10)

  return { result, totalElements }
}
