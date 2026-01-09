import type { AgentStateType } from '../state.js'
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

  const prompt = `  
    Using the following approved component spec:
    ${JSON.stringify(spec, null, 2)}

    You are a senior frontend engineer generating production-quality React components.

    RULES:
    Output ONLY valid TSX code.
    Do NOT include explanations, markdown, or comments about the task.
    Generate exactly one React component per response.
    Use TypeScript with explicit, strongly typed props.
    Use Tailwind CSS utility classes for layout, spacing, typography, and responsiveness.
    Prefer semantic HTML.
    Components must be realistic, usable, and visually structured.
    Avoid placeholder divs and generic templates.
    Do not invent files or directories.
    Code must compile without errors.
    Follow the provided proposal exactly.

    STYLE GUIDELINES:
    Use flex/grid where appropriate.
    Use sensible spacing (padding, margin, gap).
    Use readable typography defaults.
    Favor composition over minimalism.
    If prop requirements are underspecified, infer reasonable types and structure.
    Do NOT create your own custom classes

    Generate a React + TypeScript component.
    - Use TailwindCSS
    - Export the component
    - Do NOT include explanations
    - Return ONLY code
  `

  let code: string

//   try {
//     code = await askCoder(prompt)
//     const normalizedCode = normalizeCode(code)
//     code = normalizedCode
//   } catch {
//     return {
//       ...state,
//       errors: [...state.errors, "Code generation failed"],
//       step: "GENERATE_CODE",
//     }
//   }

  try{
    //Dummy LLM call
    // const coderResponse = await askCoder(prompt)
    const response = `

        import React from "react";

    interface ExampleCardProps {
    title: string;
    description: string;
    ctaLabel?: string;
    onCtaClick?: () => void;
    }

    const ExampleCard: React.FC<ExampleCardProps> = ({
    title,
    description,
    ctaLabel = "Learn more",
    onCtaClick,
    }) => {
    return (
        <div className="max-w-md rounded-2xl bg-white p-6 shadow-lg transition hover:shadow-xl">
        <h2 className="mb-2 text-xl font-semibold text-gray-900">{title}</h2>
        <p className="mb-4 text-sm text-gray-600">{description}</p>

        <div className="flex justify-end">
            <button
            onClick={onCtaClick}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
            {ctaLabel}
            </button>
        </div>
        </div>
    );
    };

    export default ExampleCard;
    `
    code = normalizeCode(response)
  }catch{
    return {
      error:["LLM failed to generate code."],
      
    }
  }
  console.log("Code normalized and state updated.")
  return {
    generatedCode: code,
  }

}