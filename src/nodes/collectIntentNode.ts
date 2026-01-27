import type { AgentStateType } from "../state.js";
import { ask } from "../util/ask.js";

export async function collectIntentNode(state: AgentStateType): Promise<Partial<AgentStateType>> {
  
  const initialPrompt = await ask('What do you want built?\nType "exit" to end session.')

  if(initialPrompt === "exit"){
    return{
      "exited": {
        "status": true,
        "node":"collectIntentNode"
      }
    }
  }

  
  return{

  }
}