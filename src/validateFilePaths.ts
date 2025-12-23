import isSafePath from "./utils/isSafePath.js"

const validateFilePaths = (filePaths:string[]):{result:string, error:string} => {
  const ROOT = process.cwd()
  const checkSafePathResult = filePaths.map( filePath => {
    return isSafePath(ROOT,filePath)
  })
  if(checkSafePathResult.includes(false)){
    return {result:'', error:'File paths are not safe.'}
  }
  return {result:'File paths are safe.', error:''}
}

export default validateFilePaths