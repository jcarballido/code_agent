import type { AgentState } from "../state.js"

export async function receiveTask(
  state: AgentState
): Promise<AgentState> {
  console.log("Received task:")
  console.log("  Task:", state.task)
  console.log("  Project root:", state.projectRoot)

  // Normalize state for safety
  return {
    task: state.task,
    projectRoot: state.projectRoot,
    done: false
  }
}
