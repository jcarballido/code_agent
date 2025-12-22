import { constraints } from "./rules.js"

const validateConstraints = (parsedConstraints: string[]):boolean => {
  const splitConstraints = constraints.split('\n')
  return parsedConstraints === splitConstraints
}

export default validateConstraints
