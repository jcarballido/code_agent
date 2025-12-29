import { CODE_MODEL, PROPOSAL_MODEL } from "../constants.js"
import PROPOSAL_REQUIREMENTS from "../plannerRules.js"
import type { ParseProposal } from "../types.js"
import {spawn} from "node:child_process"
import parseProposal from "./parseProposal.js"
import CODER_RULES from '../coderRules.js'

export default function askCoder(prompt: string): Promise<string> {
  return new Promise((res, rej) => {
    const proc = spawn('ollama',['run', CODE_MODEL, CODER_RULES + prompt])
    proc.stdin.end()

    let buffer = ''
    proc.stdout.on('data',(data)=>{
      const chunk = data.toString()
      // process.stdout.write( chunk)
      buffer += chunk
    })

    proc.on('close',(code)=>{
      if(code == 0) {
        console.log('Closing spawned process.')
        console.log('Coder model output the following:')
        const outputSplit = buffer.split('\n')
        let start = 0
        let last = outputSplit.length - 1
      
        while(start < last && outputSplit[start]?.trim() == '') start++
        while(last > start && outputSplit[last]?.trim() == '') last--
        
        if(outputSplit[start]?.trim().startsWith(`\`\`\``)){
          start++
          if(outputSplit[last]?.trim().startsWith(`\`\`\``)){
            last--
          }
        }
        const trimmedOutput = outputSplit.slice(start,last+1).join('\n')
        res(trimmedOutput)
      }
      else rej(`Error on close with code: ${code}`)
    })
    proc.on('error', (err) => rej(err))
  })
}