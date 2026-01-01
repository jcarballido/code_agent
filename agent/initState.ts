import { AgentState } from "./state"

export function initAgentState(description: string): AgentState {
  return {
    description,
    componentSpec: undefined,
    generatedCode: undefined,
    specApproved: false,
    codeApproved: false,
    step: "GENERATE_SPEC",
    errors: [],
    validationAttempts:0,
    validationHistory:[]
  }
}
