import { initAgentState } from "./initState"
import { runStep } from "./runner"

async function main() {
  let state = initAgentState(
    "A reusable avatar component with fallback initials"
  )

  while (state.step !== "DONE") {
    state = await runStep(state)
  }
  console.log('Component spec at current state:')
  console.log('---START---')
  console.log(state.componentSpec)  
  console.log('---END---')
  console.log("Agent finished")
}

main()
