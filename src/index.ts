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

console.log('Chat started. Enter "exit" to quit.')

async function chat(){
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const instructionPrompt = await prompt(rl,'What do you want built?\n')
  
  const instructionProposal = await generateProposal(instructionPrompt)

  console.log('Instruction Proposal by LLama planner:')
  console.log('---START---')
  console.log(instructionProposal)
  console.log('---END---')

  const instructionApproval = await prompt(rl,'Continue with generating this code? [y/n]\n')

  if(instructionApproval == 'y' || instructionApproval == 'Y' || instructionApproval == 'Yes' || instructionApproval =='yes' || instructionApproval == 'YES'){
    const coderOutput = await askCoder(instructionProposal)
    console.log('Coder model output the following:')
    console.log('---start---')
    console.log(coderOutput)
    console.log('---end---')
    const outputSplit = coderOutput.split('\n')
    let start = 0
    let last = outputSplit.length - 1
  
    while(start < last && outputSplit[start]?.trim() == '') start++
    while(last > start && outputSplit[last]?.trim() == '') last--
  
    console.log('Start element: ',outputSplit[start])
    console.log('Last element: ',outputSplit[last])
  
    if(outputSplit[start]?.trim().startsWith(`\`\`\``)){
      start++
      if(outputSplit[last]?.trim().startsWith(`\`\`\``)){
        last--
      }
    }
  
    const trimmedOutput = outputSplit.slice(start,last+1).join('\n')
  
    console.log('Trimmed output:')
    console.log('---start---')
    console.log(trimmedOutput)
    console.log('---end---')
    // console.log('Current working dir: ', process.cwd())
    const approval = await prompt(rl,'Do you want to write this output? [y/n] \n')
    if(approval == 'y' || approval == 'Y' || approval == 'Yes' || approval == 'yes'){
      const filePath = path.resolve(
        process.cwd(),
        'src/ImageComponent.ts'
      )
      fs.writeFileSync(filePath, trimmedOutput, 'utf-8')
    }
  }

  // const concatenatedPrompt = STATIC_SYSTEM_RULES + DYNAMIC_SYSTEM_RULES 
  // const props: string = await prompt(rl, 'What props will this component need? \n')
  // const behaviors: string = await prompt(rl,'What behaviors will the component exhibit? \n')

  // const behaviorsSplit = behaviors.split(",")
  
  // const propsSplit = props.split(",")
  // const propNamesAndTypes:{[key:string]:string} = {}
  // for(const prop of propsSplit){
  //   const match = prop.match(/(\w*):\s?(\w*)/) || ''
  //   if(typeof match !== 'string'){
  //     const [, propName, propType] = match
  //     cons
  //     if(propName == 'string' && propType == 'string') propNamesAndTypes[propName] = propType
  //     else console.log('Props could not be determined')
  //   }
  // }

  // const propsSplit = props.split(",")

  // const capturedInput: string = dynamicInput({
  //   componentName,
  //   behaviors:behaviorsSplit,
  //   props:propsSplit
  // }) 

  // console.log('Captured Input: ',capturedInput)

  rl.close()
  console.log('Agent exiting process. Goodbye!')
}

chat()
