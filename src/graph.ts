import { StateGraph } from "@langchain/langgraph"
import { AgentState } from "./state.js"
import { planNode } from "./nodes/plan.js"

export const agent = new StateGraph(AgentState)
  .addNode("planNode",planNode)
  .addEdge("__start__","planNode")
  .addEdge("planNode","__end__")
  .compile()
    
