import askCoder from "./askCoder.js"
// import validateConstraints from "../validateConstraints.js"
import validateFilePaths from "../validateFilePaths.js"
import type { ParseProposal } from "../types.js"
import askPlanner from "./askPlanner.js"
import { resolve } from "node:dns"

const requestProposal = (prompt: string): Promise<string> => {

  return new Promise(async(resolve, reject) => {
    try {
      const instructionProposal = await askPlanner(prompt)
      
      // const areFilePathsValid = validateFilePaths(parsedProposal.files)
      // if(areFilePathsValid.result == 'failed'){
      //   console.log('File paths failed.')
      //   if(rejectionCause.files.length == 0) rejectionCause.files.push(areFilePathsValid.error)
      // }else{
      //   console.log('File paths passed.')
      //   rejectionCause.files = []
      // }
      
      // const areConstraintsValid = validateConstraints(parsedProposal.constraints)
      // if(areConstraintsValid.result == 'failed'){
      //   console.log('Contraints failed')
      //   if(rejectionCause.constraints.length == 0) rejectionCause.constraints.push(areConstraintsValid.error)
      // } else{
      //   console.log('Constraints passed')
      //   rejectionCause.constraints = []
      // }
    
      resolve(instructionProposal)    
    } catch (error) {
      reject(new Error(`${error}`))
    }

  })
}

export default requestProposal