// import type { AgentStateType } from "../state.js"
import type { State, Update } from "../state.js"
import { ask } from "../util/ask.js"

export async function reviewSpecNode(state: State):Promise<Update> {
  console.log("→ REVEIW_SPEC")

  console.log('---Component Spec from LLM---')
  console.log('START')
  console.log(state.specification)
  console.log('END')
  console.log('------')

  const answer = await ask(
    "Approve spec? (y = approve / r = regenerate): "
  )

  if (answer.toLowerCase() !== "y") {
    console.log("Attempting to regenerate spec...")
    const feedback = await ask("Is there any feedback?\n")
    if(feedback){
      return {
        specificationRegenerationAttempts: state.specificationRegenerationAttempts + 1,
        specificationFeedback:feedback,
        specificationHistory: [...state.specificationHistory,state.specification]
      }
    }
    return {
      specRegenerationAttempts: state.specRegenerationAttempts + 1
    }
  }

  return {
    specApproved: true
  }
  // checkpoint("SPEC_APPROVED", nextState)
}