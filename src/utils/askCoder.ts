import { CODE_MODEL, PROPOSAL_MODEL } from "../constants.js"
import PROPOSAL_REQUIREMENTS from "./parseProposal.js"
import type { ParseProposal } from "../types.js"
import {spawn} from "node:child_process"
import parseProposal from "./parseProposal.js"

export default function askCoder(prompt: string): Promise<ParseProposal> {
  return new Promise((res, rej) => {
    const proc = spawn('ollama',['run', PROPOSAL_MODEL, PROPOSAL_REQUIREMENTS + prompt])
    proc.stdin.end()

    let buffer = ''
    proc.stdout.on('data',(data)=>{
      const chunk = data.toString()
      process.stdout.write( chunk)
      buffer += chunk
    })

    proc.on('close',(code)=>{
      if(code == 0) {
        console.log('Closing spawned process.')
        const parsedProposal = parseProposal(buffer)
        res(parsedProposal)
      }
      else rej(`Error on close with code: ${code}`)
    })
    proc.on('error', (err) => rej(err))
  })
}