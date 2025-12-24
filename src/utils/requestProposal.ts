import askCoder from "./askCoder.js"
import validateConstraints from "../validateConstraints.js"
import validateFilePaths from "../validateFilePaths.js"
import type { ParseProposal } from "../types.js"

const requestProposal = async(prompt: string, rejectionCause: {files:string[],constraints: string[]}): Promise<ParseProposal> => {

  try {
    const parsedProposal = await askCoder(prompt)
    
    const areFilePathsValid = validateFilePaths(parsedProposal.files)
    if(areFilePathsValid.result == 'failed'){
      console.log('File paths failed.')
      if(rejectionCause.files.length == 0) rejectionCause.files.push(areFilePathsValid.error)
    }else{
      console.log('File paths passed.')
      rejectionCause.files = []
    }
    
    const areConstraintsValid = validateConstraints(parsedProposal.constraints)
    if(areConstraintsValid.result == 'failed'){
      console.log('Contraints failed')
      if(rejectionCause.constraints.length == 0) rejectionCause.constraints.push(areConstraintsValid.error)
    } else{
      console.log('Constraints passed')
      rejectionCause.constraints = []
    }
  
    return parsedProposal    
  } catch (error) {
    throw new Error(`${error}`)
  }
}

export default requestProposal