interface ServiceMessage {
  id: number
  message: string
  createdAt: Date
  incidentDate?: Date
}

export default ServiceMessage
