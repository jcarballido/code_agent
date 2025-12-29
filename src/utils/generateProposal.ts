import type { ParseProposal } from "../types.js"
import requestProposal from "./requestProposal.js"

const generateProposal = (input:string): Promise<string> => {
  return new Promise(async(resolve,reject) => {
    
    // let promptRetries = 0
    // let isPromptValidated = false
    // const rejectionCause:{files:string[], constraints:string[]} = {
    //   files:[],
    //   constraints:[]
    // }      
    // let validatedProposal
    // while(promptRetries < 3 && !isPromptValidated){
      // console.log('While loop executing...')
      // console.log('Prompt retries: ', promptRetries)
      try {
        // let updatedPrompt: string = ''
        // if(rejectionCause.constraints.length > 0 || rejectionCause.files.length > 0){
        //   updatedPrompt += `
        //   Your previous proposal was REJECTED for the following reasons:
        //   `
        //   if(rejectionCause.files.length > 0){
        //     updatedPrompt += `
        //     ${rejectionCause.files}
        //     `
        //   }
        //   if(rejectionCause.constraints.length > 0){
        //     updatedPrompt += `
        //     ${rejectionCause.constraints}            
        //     `
        //   }
        // }else{
        //   updatedPrompt += input
        // }
        const validatedProposal = await requestProposal(input)
        // if(rejectionCause.files.length == 0 && rejectionCause.constraints.length == 0){
        //   // console.log('Valid Porposal: ', validatedProposal)
        //   isPromptValidated = true
          resolve(validatedProposal)
        // }else{
        //   promptRetries++ 
        // }
      } catch (error) {
        console.log('Error on prompt: ', error)
        reject(new Error('Could not generate a valid proposal.'))
      }
    // }
    // if(promptRetries > 3 && !isPromptValidated) reject(new Error('Could not generate a valid proposal.'))
  })
}

export default generateProposal