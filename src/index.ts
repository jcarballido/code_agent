import readline from "node:readline"
import askCoder from "./utils/askCoder.js"
import validateFilePaths from "./validateFilePaths.js"
import validateConstraints from "./validateConstraints.js"
import requestProposal from "./utils/requestProposal.js"

console.log('Chat started. Enter "exit" to quit.')

async function chat(){
  const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
  })

  // Initiate prompt
  rl.question('Enter a prompt: ', async (input) => {
    let promptRetries = 0
    let isPromptValidated = false
    const rejectionCause:{files:string[], constraints:string[]} = {
      files:[],
      constraints:[]
    }
    
    if(input == 'exit'){
      console.log('Chat ended.')
      rl.close()
      process.exit(0)
    }
    
    while(promptRetries < 3 && !isPromptValidated){
      try {
        let updatedPrompt: string = ''
        if(rejectionCause.constraints.length > 0 || rejectionCause.files.length > 0){
          updatedPrompt += `
          Your previous proposal was REJECTED for the following reasons:
          `
          if(rejectionCause.files.length > 0){
            updatedPrompt += `
            ${rejectionCause.files}
            `
          }
          if(rejectionCause.constraints.length > 0){
            updatedPrompt += `
            ${rejectionCause.constraints}            
            `
          }
        }else{
          updatedPrompt += input
        }

        const validationResult = await requestProposal(updatedPrompt,rejectionCause)

        if(rejectionCause.files.length == 0 && rejectionCause.constraints.length == 0){
          console.log('Valid Porposal: ', validationResult)
          // Show the proposal
          // Ask for approval or rejection
          rl.question('Do you approve this proposal? Agent will then generate code for the specified files. \n [y,n]', async (input) => {
            if(input == 'yes' || input == 'y' || input == 'Yes' || input == 'Y'){
              console.log('Proposal has been accepted.')
              isPromptValidated = true
            }
          })
          // If approval, break out of loop.
          // If rejected, continue with retrying the prompt
        }
        promptRetries++ 

      } catch (error) {
        console.log('Error on prompt: ', error)
        rl.close()
        process.exit(0)
      }
    }

    console.log('Agent completed attempting to run task generation. Goodbye!')
    rl.close()
    process.exit(0)


  })

}

chat()
