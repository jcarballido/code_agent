import type { AgentStateType } from "../state.js"
import { ask } from "../util/ask.js"

export async function reviewCodeNode(state:AgentStateType): Promise<Partial<AgentStateType>>{
  console.log("→ PRESENT_FOR_REVIEW")

  console.log('Review the generated code before writing file:')
  console.log('---START---')
  console.log(state.generatedCode)  
  console.log('---END---')

  const response = await ask("Approve code? (y = approve / r = reject)")

  if (response.toLowerCase() !== "y") {
    const feedback = await ask("Is there any feedback?\n")
    if(feedback){
      return {
        codeRegenerationAttempts: state.codeRegenerationAttempts + 1,
        generateCodeFeedback:feedback,
        generatedCodeHistory: [...state.generatedCode,state.generatedCode]
      }
    }
    return {
      specRegenerationAttempts: state.codeRegenerationAttempts + 1
    }
  }

  return {
    codeApproved: true
  }
}