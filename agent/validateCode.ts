import askCoder from "../src/utils/askCoder";
import normalizeCode from "./normalizeCode";
import { AgentState } from "./state";

function isValid(generatedCode:string, componentName: string): boolean{
  if(!generatedCode.includes('export')) return false
  if(!generatedCode.includes(componentName)) return false
  if(generatedCode.includes('```')) return false
  return true
}

export async function validateCode(state: AgentState): Promise<AgentState>{
  
  if(!state.generatedCode || !state.componentSpec) throw new Error('No code to validate.')
  const cleanedCode = normalizeCode(state.generatedCode)
  let retryAtttempts = 0
  let isRegeneratedCodeValidated = false
  let regeneratedCode = cleanedCode 

  while(retryAtttempts < 3 && !isRegeneratedCodeValidated){
    if(isValid(regeneratedCode, state.componentSpec.name)){
      isRegeneratedCodeValidated = true
    }else{
      const errors: string[] = [] 
      if(!regeneratedCode.includes('export')) errors.push('Missing export statement')
      if(!regeneratedCode.includes(state.componentSpec.name)) errors.push('Component name changed or is missing.')
      if(regeneratedCode.includes('```')) errors.push('Code was fenced in by \`\`\`')
          
      const prompt = `
      The following React + TypeScript component failed validation for these reasons:
    
      ${errors.map((e) => "- " + e).join("\n")}
    
      Fix the component:
      - Do not change the component name
      - Do not change props
      - Remove fences
      - Return ONLY code
    
      ${regeneratedCode}
      `
      regeneratedCode = await askCoder(prompt)
      regeneratedCode = normalizeCode(regeneratedCode)
      retryAtttempts++
    }
  }

  if(isRegeneratedCodeValidated){
    return {
    ...state,
    generatedCode:regeneratedCode,
    step:'REVIEW_CODE'
    }
  }else{
    return{
      ...state,
      errors:[...state.errors,'Generated code FAILED validation.'],
      step:'VALIDATE_CODE'
    }
  }
}  

