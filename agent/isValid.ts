function isValid(generatedCode:string, componentName: string): boolean{
  if(!generatedCode.includes('export')) return false
  if(!generatedCode.includes(componentName)) return false
  if(generatedCode.includes('```')) return false
  return true
}

export default isValid