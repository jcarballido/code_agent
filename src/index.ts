import readline from "node:readline"
import requestProposal from "./utils/requestProposal.js"
import prompt from "./utils/prompt.js"
import generateProposal from "./utils/generateProposal.js"
import type { ParseProposal } from "./types.js"
import generateCode from "./utils/generateCode.js"
import dynamicInput, { type DynamicField } from "./dynamicInput.js"
import askCoder from "./utils/askCoder.js"
import fs from 'node:fs'
import path from "node:path"
import findLine from "./utils/findLine.js"


console.log('Chat started. Enter "exit" to quit.')

async function chat(){
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  let instructionApproved = false
  let codeApproved = false
  let approvedComponentName:string = ''
  let approvedCode:string = ''
  let approvedInstructionProposal:string = ''
  let instructionAttempts = 0
  let codeGeneratingAttempts = 0
  while(!instructionApproved && instructionAttempts < 3){
    const instructionPrompt = await prompt(rl,'What do you want built?\n')
    
    const instructionProposal = await generateProposal(instructionPrompt)
  
    console.log('Instruction Proposal by LLama planner:')
    console.log('---START---')
    console.log(instructionProposal)
    console.log('---END---')
  
    const componentNameLine = findLine(instructionProposal, 'Component')
    const match = componentNameLine.match(/.*:\s?(\w*)/)
    const [,componentName] = match || ''
    const instructionApproval = await prompt(rl,'Continue with generating this code? [y/n]\n')
    if(instructionApproval == 'y' && componentName){
      approvedComponentName = componentName
      approvedInstructionProposal = instructionProposal
      instructionApproved = true
    }else{
      instructionAttempts++
      if(instructionAttempts == 3){
        console.log("Instruction proposal attempts exceeded limit. Agent existing process. Goodbye!")
        rl.close()
        return
      }
    }
  }


  while(!codeApproved && instructionApproved && codeGeneratingAttempts < 3){
    const coderOutput = await askCoder(approvedInstructionProposal)
    console.log('---start---')
    console.log(coderOutput)
    console.log('---end---')
    const approval = await prompt(rl,'Do you want to write this output? [y/n] \n')
    if(approval == 'y'){
      approvedCode = coderOutput
      codeApproved = true
    }else{
      codeGeneratingAttempts++
      if(codeGeneratingAttempts == 3){
        console.log("Instruction proposal attempts exceeded limit. Agent existing process. Goodbye!")
        rl.close()
        return
      }
    }
  }
  
  if(instructionApproved && codeApproved){
    const filePath = path.resolve(
      process.cwd(),
      `src/${approvedComponentName}.ts`
    )
    fs.writeFileSync(filePath, approvedCode, 'utf-8')
  }

  rl.close()
  console.log('Agent exiting process. Goodbye!')
}

chat()
