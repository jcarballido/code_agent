import readline from "node:readline"
import requestProposal from "./utils/requestProposal.js"
import prompt from "./utils/prompt.js"
import generateProposal from "./utils/generateProposal.js"
import type { ParseProposal } from "./types.js"
import generateCode from "./utils/generateCode.js"
import dynamicInput, { type DynamicField } from "./dynamicInput.js"
import askCoder from "./utils/askCoder.js"

console.log('Chat started. Enter "exit" to quit.')

async function chat(){
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  // const concatenatedPrompt = STATIC_SYSTEM_RULES + DYNAMIC_SYSTEM_RULES 
  const componentName:string = await prompt(rl, 'What will be the component name? \n')
  const props: string = await prompt(rl, 'What props will this component need? \n')
  const behaviors: string = await prompt(rl,'What behaviors will the component exhibit? \n')

  const behaviorsSplit = behaviors.split(",")
  
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

  const propsSplit = props.split(",")

  const capturedInput: string = dynamicInput({
    componentName,
    behaviors:behaviorsSplit,
    props:propsSplit
  }) 

  // console.log('Captured Input: ',capturedInput)

  const coderOutput = await askCoder(capturedInput)

  console.log('Coder model output the following:')
  console.log('---start---')
  console.log(coderOutput)
  console.log('---end---')
  
  const approval = await prompt(rl,'Do you want to write this output? [y/n] \n')
  if(approval == 'y' || approval == 'Y' || approval == 'Yes' || approval == 'yes'){
    
  }


  rl.close()
  console.log('Agent exiting process. Goodbye!')
}

chat()
