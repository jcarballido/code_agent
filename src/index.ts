import readline from "node:readline"
import requestProposal from "./utils/requestProposal.js"
import prompt from "./utils/prompt.js"
import generateProposal from "./utils/generateProposal.js"
import type { ParseProposal } from "./types.js"

console.log('Chat started. Enter "exit" to quit.')

async function chat(){
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  let isProposalAccepted = false
  let acceptedProposal: ParseProposal
  while(!isProposalAccepted){
    const input = await prompt(rl, 'What are we building?')
    const validatedProposal = await generateProposal(input)
    if(typeof validatedProposal === 'string'){
      console.log('Proposal could not be validated. Please reword your original prompt.')
    }else{
      console.log('The model generated the folliwing validated proposal:')
      console.log(validatedProposal)
      const isApproved = await prompt(rl, 'Do you approve this proposal? [y/n]')
      if(isApproved == 'y' || isApproved == 'Y' || isApproved == 'Yes' || isApproved == 'yes'){
        isProposalAccepted = true
        acceptedProposal = validatedProposal
      }else{
        console.log('The proposal was rejected. Try a new prompt.')
      }
    }
  }

  // const check = await prompt(rl, 'Do you approve this proposal? [Y/N]')
  // if(check == 'y' ||check == 'Y' || check == 'Yes' || check == 'yes'){
  //   console.log('Proposal accepted')
  //   proposalApproved = true
  // }else{
  //   console.log('Proposal rejected')
  // }

  // if(proposalApproved){

  // }

  rl.close()
  console.log('Agent exiting process. Goodbye!')
}

chat()
