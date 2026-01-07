import type { AgentStateType } from "../state.js"

export function planNode(state: AgentStateType): Partial<AgentStateType> {
  console.log("Planning task...")

  return {
    plan: {
      steps: [
        "Analyze Task",
        "Create Structure",
      ]
    }
  }
}
