export type ParseProposal = {
  title:string,
  description:string,
  files:string[],
  constraints: string[],
  errors:string[]
}

export type ValidationResult = 
  | {result: 'passed', msg:string}
  | {result:'failed', error: string }
