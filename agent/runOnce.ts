import { initAgentState } from "./initState"
import { runStep } from "./runner"
import prompt from '../src/utils/prompt'
import readline from 'readline'

function ask(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer.trim())
    })
  )
}

async function main() {
  const initialState = await ask(
    'Describe what you want to build:\n'
  )

  let state = initAgentState(
    initialState
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
