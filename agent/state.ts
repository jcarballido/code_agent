import { AgentStep } from "./steps"

type ExitReason = 
  | "VALIDATION_PASSED"
  | "VALIDATION_RETRIES_EXHAUSTED"
  | "FIX_CODE_FAILED"

export type ComponentSpec = {
  name: string
  props: Array<{
    name: string
    type: string
  }>
  responsibilities: string[]
  stylingNotes: string[]
}

export type AgentState = {
  // Human input
  description: string

  // Planning output
  componentSpec?: ComponentSpec

  // Code generation
  generatedCode?: string

  // Approvals
  specApproved: boolean
  codeApproved: boolean

  // Control
  step: AgentStep
  errors: string[]

  // Validation
  validationAttempts: number
  validationHistory: {
    attempt:number,
    errors: string[]
  }[]

  //Validation and Fix_Code Node exit
  exitReason?: ExitReason
}
