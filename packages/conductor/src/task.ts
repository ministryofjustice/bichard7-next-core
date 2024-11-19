enum Task {
  ALERT_COMMON_PLATFORM = "alert_common_platform",
  COMPARE_FILES = "compares_files",
  CONVERT_SPI_TO_AHO = "convert_spi_to_aho",
  CREATE_AUDIT_LOG_RECORD = "create_audit_log_record",
  CREATE_AUDIT_LOG = "create_audit_log",
  GENERATE_DAY_TASKS = "generate_day_tasks",
  PERSIST_PHASE1 = "persist_phase1",
  PROCESS_PHASE1 = "process_phase1",
  READ_AHO_FROM_DB = "read_aho_from_db",
  RERUN_DAY = "rerun_day",
  SEND_TO_PHASE2 = "send_to_phase2",
  STORE_AUDIT_LOG_EVENTS = "store_audit_log_events"
}

export default Task
