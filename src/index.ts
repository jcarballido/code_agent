import readline from "node:readline"
import requestProposal from "./utils/requestProposal.js"
import type { Interface } from "node:readline"
import type { ParseProposal } from "./types.js"

console.log('Chat started. Enter "exit" to quit.')

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

function prompt1(rl:Interface, greeting:string):Promise<ParseProposal> {
  return new Promise((resolve) => {
    rl.question(greeting, async (input) => {

      if(input == 'exit'){
        console.log('Chat ended.')
        rl.close()
        process.exit(0)
      }

      let promptRetries = 0
      let isPromptValidated = false
      const rejectionCause:{files:string[], constraints:string[]} = {
        files:[],
        constraints:[]
      }      
      while(promptRetries < 3 && !isPromptValidated){
        console.log('While loop executing...')
        console.log('Prompt retries: ', promptRetries)
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
            resolve(validationResult)
            isPromptValidated = true
          }else{
            promptRetries++ 
          }
        } catch (error) {
          console.log('Error on prompt: ', error)
          rl.close()
          process.exit(0)
        }
      } 
    })
  })
}

async function chat(){
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  const input = await prompt(rl, 'What are we building?')
  console.log('Input entered: ', input)

  let promptRetries = 0
  let isPromptValidated = false
  const rejectionCause:{files:string[], constraints:string[]} = {
    files:[],
    constraints:[]
  }      
  let validatedProposal
  while(promptRetries < 3 && !isPromptValidated){
    console.log('While loop executing...')
    console.log('Prompt retries: ', promptRetries)
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

      validatedProposal = await requestProposal(updatedPrompt,rejectionCause)

      if(rejectionCause.files.length == 0 && rejectionCause.constraints.length == 0){
        console.log('Valid Porposal: ', validatedProposal)
        isPromptValidated = true
      }else{
        promptRetries++ 
      }
    } catch (error) {
      console.log('Error on prompt: ', error)
      rl.close()
      process.exit(0)
    }
  } 

  const check = await prompt(rl, 'Do you approve this proposal? [Y/N]')
  if(check == 'y' ||check == 'Y' || check == 'Yes' || check == 'yes'){
    console.log('Proposal accepted')
  }else{
    console.log('Proposal rejected')
  }

  rl.close()
  console.log('Agent exiting process. Goodbye!')
}

chat()
