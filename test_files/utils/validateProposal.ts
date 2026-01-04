import type { ParseProposal } from "../types.js"
import validateFilePaths from "../validateFilePaths.js"

const validateProposal = (parsedProposal: ParseProposal) => {
  const { files, constraints } = parsedProposal
  const arePathsSafe = validateFilePaths(files)
}

export default validateProposal