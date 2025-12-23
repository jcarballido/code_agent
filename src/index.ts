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
    
    while(promptRetries < 1 && !isPromptApproved){
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
        if(areFilePathsValid.result == 'failed'){
          console.log('File paths failed.')
          if(rejectionCause.files.length == 0) rejectionCause.files.push(areFilePathsValid.error)
        }else{
                console.log('File paths passed.')

          rejectionCause.files = []
        }

        const areConstraintsValid = validateConstraints(parsedProposal.constraints)
        
        if(areConstraintsValid.result == 'failed'){
          console.log('Contraints failed')
          if(rejectionCause.constraints.length == 0) rejectionCause.constraints.push(areConstraintsValid.error)
        } else{
          console.log('Constraints passed')
          rejectionCause.constraints = []
        }

        if(areConstraintsValid.result == 'passed' && areFilePathsValid.result == 'passed'){
          console.log('Proposal approved: ', parsedProposal)
          isPromptApproved = true
          rl.close()
          process.exit(0)
        }
        promptRetries++ 
                rl.close()
        process.exit(0)
      } catch (error) {
        console.log('Error on prompt: ', error)
        rl.close()
        process.exit(0)
      }
    }


  })

}

chat()
