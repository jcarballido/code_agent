import { constraints } from "./rules.js"
import type { ValidationResult } from "./types.js"

const validateConstraints = (parsedConstraints: string[]):ValidationResult => {
  // const splitConstraints = constraints.split('\n')
  const splitConstraints = constraints.split('\n')
  // console.log('Split constriaints: ', splitConstraints)
  const strippedConstraints = splitConstraints.map(constraint => {
    const extractedConstraint = constraint.match(/^-\s(.*):?/)
    return extractedConstraint?extractedConstraint[1] : ''
  })

  // console.log('Constraints from RULES: ',strippedConstraints)
  // console.log('Parsed Constraints: ', parsedConstraints)
  const constraintMatch = strippedConstraints.map((strippedConstraint,index) => {
    console.log('stripped: ', strippedConstraint)
    console.log('parsedConstraint: ', parsedConstraints[index])
    console.log('stripped vs parsed:', strippedConstraint == parsedConstraints[index])
    return strippedConstraint == parsedConstraints[index]
  })
  if(constraintMatch.includes(false)){
    return {result:'failed', error:'Parsed constraints do not match user-defined constraints.'}
  }
  return {result:'passed',msg:'Parsed constraints match user-defined constraints'}
}

export default validateConstraints
