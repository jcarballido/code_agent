import { SPEC_GENERATOR_PROMPT, SPEC_REVISION_GENERATOR_PROMPT } from "../constants/constants.js";
import type { AgentStateType } from "../state.js";
import askPlanner from "../util/askSpecGenerator.js";

export async function generateSpecNode(state:AgentStateType):Promise<Partial<AgentStateType>> {  
  console.log("→ GENERATE_SPEC")
  if (state.specApproved) {
    throw new Error("Spec is already approved and cannot be regenerated")
  }

  const isRevision = state.spec !== undefined && state.specFeedback !== undefined

  if(isRevision){
    const prompt = SPEC_REVISION_GENERATOR_PROMPT(state.componentDescription,state.specHistory,state.specFeedback)
    let spec

    try {
      const response = await askPlanner(prompt)
      spec = JSON.parse(response)      
      return {
        spec,
        specFeedback:undefined
      }
    } catch (err) {
      console.log('Error caught in generating a REVISED spec:')
      console.log(err)
      return {
        error: ["Failed to generate or parse a REVISED component spec"],
      }      
    }
  }else {
    const prompt = SPEC_GENERATOR_PROMPT(state.componentDescription)
  
    let spec
      
    try {
      const response = await askPlanner(prompt)
      spec = JSON.parse(response)
  
    } catch (err) {
      console.log('Error caught in generating an INITIAL spec:')
      console.log(err)
      return {
        error: ["Failed to generate or parse an INITIAL component spec"],
      }
    }
    return {
      spec
    }  
  }
} 