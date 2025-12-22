import path from "node:path"
const isSafePath = (workingDir:string,proposedPath:string): boolean => {
  if(path.isAbsolute(proposedPath)) return false
  const resolvedPath = path.resolve(workingDir,proposedPath)
  return resolvedPath.startsWith(workingDir + path.sep)
}

export default isSafePath