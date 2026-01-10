import { SPEC_GENERATOR_PROMPT } from "../constants/constants.js";
import type { AgentStateType } from "../state.js";
import askPlanner from "../util/askSpecGenerator.js";

export async function generateSpecNode(state:AgentStateType):Promise<Partial<AgentStateType>> {  
  console.log("→ GENERATE_SPEC")
  if (state.specApproved) {
    throw new Error("Spec is already approved and cannot be regenerated")
  }
  const prompt = SPEC_GENERATOR_PROMPT(state.componentDescription)

  let spec
    
  try {
    const response = await askPlanner(prompt)
    // const response = `
    //   {
    //     "name": "DummyComponentName",
    //     "props": [{ "name": "propName", "type": "string" }],
    //     "responsibilities": ["Handles image renderind","Handles Title rendering"],
    //     "stylingNotes": ["A little up", "A little left"]
    //   }      
    // `      
    spec = JSON.parse(response)

  } catch (err) {
    console.log('Error caught in generating spec:')
    console.log(err)
    return {
      error: ["Failed to generate or parse component spec"],
    }
  }

  return {
    spec
  }
} 