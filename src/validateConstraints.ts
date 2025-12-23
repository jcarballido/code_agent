import { constraints } from "./rules.js"
import type { ValidationResult } from "./types.js"

const validateConstraints = (parsedConstraints: string[]):ValidationResult => {
  // const splitConstraints = constraints.split('\n')
  if(constraints !== parsedConstraints.join('\n')){
    return {result:'failed', error:'Parsed constraints do not match user-defined constraints.'}
  }
  return {result:'passed',msg:'Parsed constraints match user-defined constraints'}
}

export default validateConstraints
