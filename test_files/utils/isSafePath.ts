import path from "node:path"
const isSafePath = (workingDir:string,proposedPath:string): boolean => {
  console.log('Proposed Path: ',proposedPath)
  if(path.isAbsolute(proposedPath)) return false
  const resolvedPath = path.resolve(workingDir,proposedPath)
  console.log('Working dir: ', workingDir+path.sep+'src/')
  console.log('resolved path: ', resolvedPath)
  return resolvedPath.startsWith(workingDir + path.sep + 'src/')
}

export default isSafePath