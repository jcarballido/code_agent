import { StateGraph } from "@langchain/langgraph"
import { AgentState } from "./state.js"
import { generateSpecNode } from "./nodes/generateSpecNode.js"
import { reviewSpecNode } from "./nodes/reviewSpecNode.js"

export const agent = new StateGraph(AgentState)
  .addNode("generateSpecNode",generateSpecNode)
  .addNode("reviewSpecNode",reviewSpecNode)
  .addEdge("__start__","generateSpecNode")
  .addEdge("generateSpecNode","reviewSpecNode")
  .addConditionalEdges("reviewSpecNode",(AgentState) => {
    if(AgentState.specRegenerationAttempts > 2) return "ATTEMPTS_EXCEEDED"
    if(AgentState.specApproved) return "DONE"
    return "CONTINUE"
  },{
    "ATTEMPTS_EXCEEDED":"__end__",
    "CONTINUE":"generateSpecNode",
    "DONE": "__end__"
  })
  .compile()
    
