import readline from "node:readline"
import askCoder from "./utils/askCoder.js"
import validateFilePaths from "./validateFilePaths.js"
import validateConstraints from "./validateConstraints.js"
import { constraints } from "./rules.js"

console.log('Chat started. Enter "exit" to quit.')

async function chat(){
  const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
  })

  // Initiate prompt
  rl.question('Enter a prompt: ', async (input) => {
    const repromptTriggers:string[] = []
    let promptRetries = 0
    let isPromptApproved = false
    const rejectionCause:{files:string[], constraints:string[]} = {
      files:[],
      constraints:[]
    }
    
    if(input == 'exit'){
      console.log('Chat ended.')
      rl.close()
      process.exit(0)
    }
    
    while(promptRetries < 3 && !isPromptApproved){
      try {
        let updatedPrompt = input
        if(rejectionCause.files.length > 0){
          updatedPrompt += ''
          if(rejectionCause.constraints.length > 0){
            updatedPrompt += ''
          }
        }
        const parsedProposal = await askCoder(updatedPrompt)
        // Run a validation check
        // If validation succeeds, the proposal has been approved and isPromptAllowed flips true.
        // If validation fails, increment promptRetries
        
        const areFilePathsValid = validateFilePaths(parsedProposal.files)
        if(areFilePathsValid.error !== ''){
          if(rejectionCause.files.length == 0) rejectionCause.files.push('Proposed file paths were outside of the user-specified working directory.')
        }else{
          rejectionCause.files = []
        }

        const areConstraintsValid = validateConstraints(parsedProposal.constraints)
        
        const { errors } = parsedProposal
        repromptTriggers.push(...errors)
        // Check constraints
        if(areConstraintsValid) console.log('CONSTRAINTS were not provided in the proposal. Check the rules include them. Chat ended')
          
          if (repromptTriggers.length > 0) {
            console.log('Reprompt necesarry for the following reasons: ',repromptTriggers)
          }  
          
        } catch (error) {
          console.log('Error on prompt: ', error)
          if(!areConstraintsValid) {
            console.log('CONSTRAINTS were not provided in the proposal. Check the rules include them. Chat ended')
            rl.close()
            process.exit(0)
          }
        }
    }
  })

}

chat()
