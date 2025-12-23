import readline from "node:readline"
import askCoder from "./utils/askCoder.js"
import validateFilePaths from "./validateFilePaths.js"
import validateConstraints from "./validateConstraints.js"

console.log('Chat started. Enter "exit" to quit.')

async function chat(){
  const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
  })

  // Initiate prompt
  rl.question('Enter a prompt: ', async (input) => {
    const repromptTriggers:string[] = []
    let repromptRetries = 0
    let isPromptApproved = false
    
    if(input == 'exit'){
      console.log('Chat ended.')
      rl.close()
      process.exit(0)
    }
    
    while(repromptRetries < 3 && !isPromptApproved){
      try {
        const parsedBuffer = await askCoder(input)
        // Run a validation check
        // If validation succeeds, the proposal has been approved and isPromptAllowed flips true.
        // If validation fails
        
        const areFilePathsValid = validateFilePaths(parsedBuffer.files)
        if(areFilePathsValid) repromptTriggers.push('Paths are not safe.')
  
        const areConstraintsValid = validateConstraints(parsedBuffer.constraints)
        if(!areConstraintsValid) {
          console.log('CONSTRAINTS were not provided in the proposal. Check the rules include them. Chat ended')
          rl.close()
          process.exit(0)
        }
  
        const { errors } = parsedBuffer
        repromptTriggers.push(...errors)
        // Check constraints
        if(areConstraintsValid) console.log('CONSTRAINTS were not provided in the proposal. Check the rules include them. Chat ended')
  
        if (repromptTriggers.length > 0) {
          console.log('Reprompt necesarry for the following reasons: ',repromptTriggers)
        }  
  
      } catch (error) {
        console.log('Error on prompt: ', error)
      }
    }
  })

}

chat()
