import { CODE_GENERATOR_PROMPT } from '../constants/constants.js'
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

  const prompt = CODE_GENERATOR_PROMPT(spec)

  let code: string

  try {
    code = await askCodeGenerator(prompt)
    const normalizedCode = normalizeCode(code)
    code = normalizedCode
  } catch {
    return {
      error: ["Code generation failed"],
    }
  }

  // try{
  //   //Dummy LLM call
  //   // const coderResponse = await askCoder(prompt)
  //   const response = `

  //       import React from "react";

  //   interface ExampleCardProps {
  //   title: string;
  //   description: string;
  //   ctaLabel?: string;
  //   onCtaClick?: () => void;
  //   }

  //   const ExampleCard: React.FC<ExampleCardProps> = ({
  //   title,
  //   description,
  //   ctaLabel = "Learn more",
  //   onCtaClick,
  //   }) => {
  //   return (
  //       <div className="max-w-md rounded-2xl bg-white p-6 shadow-lg transition hover:shadow-xl">
  //       <h2 className="mb-2 text-xl font-semibold text-gray-900">{title}</h2>
  //       <p className="mb-4 text-sm text-gray-600">{description}</p>

  //       <div className="flex justify-end">
  //           <button
  //           onClick={onCtaClick}
  //           className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  //           >
  //           {ctaLabel}
  //           </button>
  //       </div>
  //       </div>
  //   );
  //   };

  //   export default ExampleCard;
  //   `
  //   code = normalizeCode(response)
  // }catch{
  //   return {
  //     error:["LLM failed to generate code."],
      
  //   }
  // }
  return {
    generatedCode: code,
  }

}