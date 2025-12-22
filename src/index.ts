import readline from "node:readline"
import askCoder from "./utils/askCoder.js"
import isSafePath from "./utils/isSafePath.js"

console.log('Chat started. Enter "exit" to quit.')

async function chat(){
  const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
  }
  )

  rl.question('Enter a prompt: ', async (input) => {
    const repromptTriggers:string[] = []
    let repromptRetries = 0

    if(input == 'exit'){
      console.log('Chat ended.')
      rl.close()
      process.exit(0)
    }
    
    try {
      const parsedBuffer = await askCoder(input)
      // Check output paths
      const workingPath = '/home/toast/Development/ai_projects/code_agent'
      const filePaths = parsedBuffer.files
      const checkSafePathResult = filePaths.map( filePath => {
        return isSafePath(workingPath,filePath)
      })
      if(checkSafePathResult.includes(false)) repromptTriggers.push('Paths are not safe.')
      // Check constraints
      const { errors } = parsedBuffer
      repromptTriggers.push(...errors)
      if(parsedBuffer.constraints.length == 0) {
        console.log('CONSTRAINTS were not provided in the proposal. Check the rules include them. Chat ended')
        rl.close()
        process.exit(0)
      }
      if (repromptTriggers.length > 0) {
        console.log('Reprompt necesarry for the following reasons: ',repromptTriggers)
      }  

    } catch (error) {
      console.log('Error on prompt: ', error)
    }
  })
}

chat()
