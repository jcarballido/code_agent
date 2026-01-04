import type { AgentState } from "../state.js"

export async function finish(state: AgentState): Promise<AgentState> {
  console.log("Workflow complete.")
  return state
}
