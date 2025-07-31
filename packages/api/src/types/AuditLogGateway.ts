interface AuditLogGateway {
  createAuditLog: (record: string) => void
}

export default AuditLogGateway
