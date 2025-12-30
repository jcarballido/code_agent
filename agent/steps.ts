export type AgentStep =
  | "COLLECT_DESCRIPTION"
  | "GENERATE_SPEC"
  | "REVIEW_SPEC"
  | "GENERATE_CODE"
  | "REVIEW_CODE"
  | "WRITE_FILE"
  | "DONE"
