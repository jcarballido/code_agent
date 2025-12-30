import { AgentState } from "./state"

const mcpStore = new Map<string, AgentState>()

export function checkpoint(
  key: string,
  state: AgentState
) {
  // Deep copy to avoid mutation bugs
  mcpStore.set(key, JSON.parse(JSON.stringify(state)))
}

export function restore(
  key: string
): AgentState {
  const snapshot = mcpStore.get(key)
  if (!snapshot) {
    throw new Error(`No MCP found for ${key}`)
  }
  return JSON.parse(JSON.stringify(snapshot))
}
