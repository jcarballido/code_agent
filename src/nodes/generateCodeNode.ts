import { CODE_GENERATOR_PROMPT, CODE_REGENERATION_PROMPT } from '../constants/constants.js'
import type { AgentStateType } from '../state.js'
import askCodeGenerator from '../util/askCodeGenerator.js'
import normalizeCode from '../util/normalizeCode.js'

export async function generateCodeNode(state: AgentStateType): Promise<Partial<AgentStateType>> {

  console.log('→ GENERATE_CODE')

  if(!state.specApproved){
    throw new Error("Spec has not been approved")
  } 

  if (!state.spec) {
    throw new Error("Cannot generate code without an approved spec")
  }

  const spec = state.spec

  const isRevision = state.generatedCode !== undefined && state.generateCodeFeedback !== undefined
  let code: string
  if(isRevision){
    const prompt = CODE_REGENERATION_PROMPT(spec,state.generatedCode,state.generateCodeFeedback)

    try {
      code = await askCodeGenerator(prompt)
      const normalizedCode = normalizeCode(code)
      code = normalizedCode
    } catch {
      return {
        error: ["Code generation failed"],
      }
    }    
  }else{
    const prompt = CODE_GENERATOR_PROMPT(spec)
    
    try {
      code = await askCodeGenerator(prompt)
      const normalizedCode = normalizeCode(code)
      code = normalizedCode
    } catch {
      return {
        error: ["Code generation failed"],
      }
    }
  }  

  return{
    generatedCode:code
  }
}