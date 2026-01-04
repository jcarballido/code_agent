import type { Interface } from "node:readline"

function prompt(rl:Interface, greeting: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(greeting, (input) => {
      if(input == 'exit'){
        console.log('Chat ended.')
        rl.close()
        process.exit(0)
      }
      resolve(input)      
    })
  })
}

export default prompt