import type { AgentStateType } from "../state.js"
import { ask } from "../util/ask.js"

export async function reviewSpecNode(state: AgentStateType):Promise<Partial<AgentStateType>> {
  console.log("→ REVEIW_SPEC")

  console.log('---Component Spec from LLM---')
  console.log('START')
  console.log(state.spec)
  console.log('END')
  console.log('------')

  const answer = await ask(
    "Approve spec? (y = approve / r = regenerate): "
  )

  if (answer.toLowerCase() !== "y") {
    console.log("Attempting to regenerate spec...")
    return {
      specRegenerationAttempts: state.specRegenerationAttempts + 1
    }
  }

  return {
    specApproved: true
  }
  // checkpoint("SPEC_APPROVED", nextState)
}