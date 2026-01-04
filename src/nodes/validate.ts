import type { AgentState } from "../state.js"

export async function validate(
  state: AgentState
): Promise<AgentState> {
  console.log("Validating generated project...")

  const errors: string[] = []

  if (!state.files || Object.keys(state.files).length === 0) {
    errors.push("No files were generated")
  }

  return {
    ...state,
    errors,
    done: errors.length === 0
  }
}
