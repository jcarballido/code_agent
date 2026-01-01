import { AgentStep } from "./steps"

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
}
