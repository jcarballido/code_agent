import { StateGraph } from "@langchain/langgraph"
import { AgentState } from "./state.js"
import { generateSpecNode } from "./nodes/generateSpecNode.js"
import { reviewSpecNode } from "./nodes/reviewSpecNode.js"
import { generateCodeNode } from "./nodes/generateCodeNode.js"
import { validateCodeNode } from "./nodes/validateCodeNode.js"
import { reviewCodeNode } from "./nodes/reviewCodeNode.js"


export const agent = new StateGraph(AgentState)
  .addNode("generateSpecNode",generateSpecNode)
  .addNode("reviewSpecNode",reviewSpecNode)
  .addNode("generateCodeNode", generateCodeNode)
  .addNode("validateCodeNode", validateCodeNode)
  .addNode("reviewCodeNode", reviewCodeNode)
  .addEdge("__start__","generateSpecNode")
  .addEdge("generateSpecNode","reviewSpecNode")
  .addConditionalEdges("reviewSpecNode",(AgentState) => {
    if(AgentState.specRegenerationAttempts > 2) return "ATTEMPTS_EXCEEDED"
    if(AgentState.specApproved) return "APPROVED"
    return "CONTINUE"
  },{
    "ATTEMPTS_EXCEEDED":"__end__",
    "CONTINUE":"generateSpecNode",
    "APPROVED": "generateCodeNode"
  })
  .addEdge("generateCodeNode","validateCodeNode")
  .addConditionalEdges("validateCodeNode",(AgentState) => {
    if(AgentState.codeRegenerationAttempts > 2) return "CODE_REGENERATION_ATTEMPTS_EXCEEDED"
    if(AgentState.codeValidated){
      return "SUCCESSFULL"
    }
    console.log("Errors found in valiation:")
    console.log(AgentState.error)
    return "FAILED"
  },{
    "CODE_REGENERATION_ATTEMTPS_EXCEEDED":"__end__",
    "SUCCESSFULL":"reviewCodeNode",
    "FAILED":"generateCodeNode"
  })
  .addConditionalEdges("reviewCodeNode",(AgentState) => {
    if(AgentState.done) return "CODE_APPROVED"
    return "REJECTED"
  },{
    "CODE_APPROVED":"__end__",
    "REJECTED": "generateCodeNode"
  })
  .compile()
    
