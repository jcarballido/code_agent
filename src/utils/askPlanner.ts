import { CODE_MODEL, PROPOSAL_MODEL } from "../constants.js"
import PLANNER_RULES from "../plannerRules.js"
import type { ParseProposal } from "../types.js"
import {spawn} from "node:child_process"
import parseProposal from "./parseProposal.js"
import CODER_RULES from '../coderRules.js'

export default function askPlanner
(prompt: string): Promise<string> {
  return new Promise((res, rej) => {
    const proc = spawn('ollama',['run', PROPOSAL_MODEL, PLANNER_RULES + prompt])
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
        // const parsedProposal = parseProposal(buffer)
        res(buffer)
      }
      else rej(`Error on close with code: ${code}`)
    })
    proc.on('error', (err) => rej(err))
  })
}