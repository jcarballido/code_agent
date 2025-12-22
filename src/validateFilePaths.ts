import isSafePath from "./utils/isSafePath.js"

const validateFilePaths = (filePaths:string[]):boolean => {
  const ROOT = process.cwd()
  const checkSafePathResult = filePaths.map( filePath => {
    return isSafePath(ROOT,filePath)
  })
  return checkSafePathResult.includes(false)
}

export default validateFilePaths