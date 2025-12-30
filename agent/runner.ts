import { AgentState } from "./state"
import {
  generateSpec,
  reviewSpec,
  generateCode,
  reviewCode,
  writeFile,
} from "./stepsHandler"


export async function runStep(
  state: AgentState
): Promise<AgentState> {
  switch (state.step) {
    case "GENERATE_SPEC":
      return await generateSpec(state)

    case "REVIEW_SPEC":
      return await reviewSpec(state)

    case "GENERATE_CODE":
      return await generateCode(state)

    case "REVIEW_CODE":
      return await reviewCode(state)

    case "WRITE_FILE":
      return await writeFile(state)

    case "DONE":
      return state

    default:
      throw new Error(`Unknown step: ${state.step}`)
  }
}
