import type { AgentState } from "../state.js"

export async function apply(
  state: AgentState
): Promise<AgentState> {
  console.log("Applying plan...")

  // Simulate writing files
  const files = {
    "README.md": "# Generated Project",
    "package.json": JSON.stringify({
      name: "project_generated",
      version: "0.1.0"
    }, null, 2)
  }

  return {
    ...state,
    files
  }
}
