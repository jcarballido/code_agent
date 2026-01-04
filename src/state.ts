export type AgentState = {
  /** High-level instruction from you */
  task: string

  /** Absolute or relative path to the project being worked on */
  projectRoot: string

  /** Planning output */
  plan?: {
    steps: string[]
  }

  /** Files the agent intends to write or has written */
  files?: Record<string, string>

  /** Errors discovered during validation */
  errors?: string[]

  /** Marks successful completion */
  done?: boolean
}
