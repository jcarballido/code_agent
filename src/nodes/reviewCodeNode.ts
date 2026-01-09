import type { AgentStateType } from "../state.js"
import { ask } from "../util/ask.js"

export async function reviewCodeNode(state:AgentStateType): Promise<Partial<AgentStateType>>{
  console.log("→ PRESENT_FOR_REVIEW")

  console.log('Review the generated code before writing file:')
  console.log('---START---')
  console.log(state.generatedCode)  
  console.log('---END---')

  const response = await ask("Approve code? (y = approve / r = reject)")
  if(response !== 'y'){
    return {
      codeRegenerationAttempts: state.codeRegenerationAttempts + 1
    }
  }

  return {
    done: true
  }
}