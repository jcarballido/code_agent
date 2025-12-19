// const readline = require("readline")
// const { exec,spawn } = require('child_process');
// const PROPOSAL_RULES = require('../tools/saftey_rules.cjs')

import readline from "node:readline"
import {spawn} from 'child_process'
import PROPOSAL_REQUIREMENTS from "./rules.js"

// console.log('Proposal Rules: ', PROPOSAL_RULES)

console.log('Running agent script.')

const CODE_MODEL = 'coder'
const PROPOSAL_MODEL = 'llama3.1'

function askCoder(prompt: string) {
  return new Promise((res, rej) => {
    const proc = spawn('ollama',['run', PROPOSAL_MODEL, PROPOSAL_REQUIREMENTS + prompt])
    proc.stdin.end()

    proc.stdout.on('data',(data)=>{
      const chunk = data.toString()
      process.stdout.write(chunk)
    })

    proc.on('close',(code)=>{
      if(code == 0) res('Success')
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
        await askCoder(input)        
      } catch (error) {
        console.log('Error on prompt: ', error)
      }
      prompt()
    })
  }

  prompt()
}

chat()
