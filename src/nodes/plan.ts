import type { AgentState } from "../state.js"

export async function plan(
  state: AgentState
): Promise<AgentState> {
  console.log("Planning task...")

  return {
    ...state,
    plan: {
      steps: [
        "Initialize project structure",
        "Set up frontend with Tailwind",
        "Set up backend API",
        "Validate project"
      ]
    }
  }
}
