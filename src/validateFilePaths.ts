import isSafePath from "./utils/isSafePath.js"
import type { ValidationResult } from "./types.js"

const validateFilePaths = (filePaths:string[]):ValidationResult => {
  const ROOT = process.cwd()
  const checkSafePathResult = filePaths.map( filePath => {
    return isSafePath(ROOT,filePath)
  })
  if(checkSafePathResult.includes(false)){
    return {result:'failed', error:'File paths are not safe.'}
  }
  return {result:'passed', msg:'File paths are safe.' }
}

export default validateFilePaths