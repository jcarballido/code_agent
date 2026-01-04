import { CompiledGraph, StateGraph } from "@langchain/langgraph"
import type { AgentState } from "./state.js"

import { receiveTask } from "./nodes/receiveTask.js"
import { plan } from "./nodes/plan.js"
import { apply } from "./nodes/apply.js"
import { validate } from "./nodes/validate.js"
import { finish } from "./nodes/finish.js"

export function buildGraph():CompiledGraph<AgentState> {
  const graph = new StateGraph<AgentState>()

  // Add nodes
  graph.addNode("receiveTask", receiveTask)
  graph.addNode("plan", plan)
  graph.addNode("apply", apply)
  graph.addNode("validate", validate)
  graph.addNode("finish", finish)

  // Entry node
  graph.setEntryPoint("receiveTask")

  // Connect deterministic flow
  graph.addEdge("receiveTask", "plan")
  graph.addEdge("plan", "apply")
  graph.addEdge("apply", "validate")

  // Conditional edge: if validation passed → finish, else retry plan
  graph.addConditionalEdges("validate", (state) => {
    return state.done ? "finish" : "plan"
  })

  return graph.compile()
}
