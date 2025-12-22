import readline from "node:readline"
import {spawn} from 'child_process'
import PROPOSAL_REQUIREMENTS from "./rules.js"
import parseProposal from "./utils/parseProposal.js"
import path from "node:path"
import type { ParseProposal } from "./types.js"
import askCoder from "./utils/askCoder.js"

console.log('Running agent script.')

// function askCoder(prompt: string): Promise<ParseProposal> {
//   return new Promise((res, rej) => {
//     const proc = spawn('ollama',['run', PROPOSAL_MODEL, PROPOSAL_REQUIREMENTS + prompt])
//     proc.stdin.end()

//     let buffer = ''
//     proc.stdout.on('data',(data)=>{
//       const chunk = data.toString()
//       process.stdout.write( chunk)
//       buffer += chunk
//     })

//     proc.on('close',(code)=>{
//       if(code == 0) {
//         console.log('Closing spawned process.')
//         const parsedProposal = parseProposal(buffer)
//         res(parsedProposal)
//       }
//       else rej(`Error on close with code: ${code}`)
//     })
//     proc.on('error', (err) => rej(err))
//   })
// }

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
  }
)

async function chat(){
  console.log('Chat started. Enter "exit" to quit.')

  const isSafePath = (workingDir:string,proposedPath:string): boolean => {
    if(path.isAbsolute(proposedPath)) return false
    const resolvedPath = path.resolve(workingDir,proposedPath)
    return resolvedPath.startsWith(workingDir + path.sep)
  }

  const prompt = () => {
    rl.question('Enter a prompt: ', async (input) => {
      const repromptTriggers:string[] = []
      let repromptRetries = 0
      if(input == 'exit'){
        console.log('Chat ended.')
        rl.close()
        process.exit(0)
      }
      try {
        const parsedBuffer = await askCoder(input)
        // Check output paths
        const workingPath = '/home/toast/Development/ai_projects/code_agent'
        const filePaths = parsedBuffer.files
        const checkSafePathResult = filePaths.map( filePath => {
          return isSafePath(workingPath,filePath)
        })
        if(checkSafePathResult.includes(false)) repromptTriggers.push('Paths are not safe.')
        // Check constraints
        const { errors } = parsedBuffer
        repromptTriggers.push(...errors)
        if(parsedBuffer.constraints.length == 0) {
          console.log('CONSTRAINTS were not provided in the proposal. Check the rules include them. Chat ended')
          rl.close()
          process.exit(0)
        }
        if (repromptTriggers.length > 0) {
          console.log('Reprompt necesarry for the following reasons: ',repromptTriggers)
        }  

      } catch (error) {
        console.log('Error on prompt: ', error)
      }
      prompt()
    })
  }

  prompt()
}

chat()
