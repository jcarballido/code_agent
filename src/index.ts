// const readline = require("readline")
// const { exec,spawn } = require('child_process');
// const PROPOSAL_RULES = require('../tools/saftey_rules.cjs')

import readline from "node:readline"
import {spawn} from 'child_process'
import PROPOSAL_REQUIREMENTS from "./rules.js"
import parseProposal from "./utils/parseProposal.js"
import path from "node:path"
// console.log('Proposal Rules: ', PROPOSAL_RULES)

type ParseProposal = {
  title:string,
  description:string,
  files:string[],
  constraints: string[],
  errors:string[]
}
console.log('Running agent script.')

const CODE_MODEL = 'coder'
const PROPOSAL_MODEL = 'llama3.1'

function askCoder(prompt: string) {
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
        // console.log('Parsed proposal: ', parsedProposal.title)
        // process.stdout.write(`Parsed title: ${parsedProposal.title}`)
        res(parsedProposal)
      }
      else rej(`Error on close with code: ${code}`)
    })
    proc.on('error', (err) => rej(err))
  })
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
  }
)

async function chat(){
  console.log('Chat started. Enter "exit" to quit.')

  const prompt = () => {
    rl.question('Enter a prompt: ', async (input) => {
      if(input == 'exit'){
        console.log('Chat ended.')
        rl.close()
        process.exit(0)
      }
      try {
        const parsedBuffer: ParseProposal = await askCoder(input)
        const isSafePath = (workingDir:string,proposedPath:string): boolean => {
          if(path.isAbsolute(proposedPath)) return false
          const resolvedPath = path.resolve(workingDir,proposedPath)
          return resolvedPath.startsWith(workingDir + path.sep)
        }
        const workingPath = '/home/toast/Development/ai_projects/code_agent'
        const files = parsedBuffer.files
        if(!isSafePath(workingPath,)) console.log('')
        console.log('Parsed Title: ',parsedBuffer )        
      } catch (error) {
        console.log('Error on prompt: ', error)
      }
      prompt()
    })
  }

  prompt()
}

chat()
