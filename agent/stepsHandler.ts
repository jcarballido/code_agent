import { AgentState } from "./state"
import askPlanner from '../src/utils/askPlanner'
import readline from "readline"
import { checkpoint, restore } from "./mcp"
import askCoder from '../src/utils/askCoder'
import path from "path"
import fs from 'fs'
import normalizeCode from "./normalizeCode"
import isValid from "./isValid"

function ask(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer.trim())
    })
  )
}

export async function generateSpec(state: AgentState): Promise<AgentState> {
  console.log("→ GENERATE_SPEC")
  if (state.specApproved) {
  throw new Error("Spec is already approved and cannot be regenerated")
}
  const prompt = `
  You are a senior frontend engineer generating production-quality React components.

  Given the following component description:

  "${state.description}"

  Return ONLY valid JSON with this shape:

  {
    "name": "ComponentName",
    "props": [{ "name": "propName", "type": "string" }],
    "responsibilities": ["..."],
    "stylingNotes": ["..."]
  }

  RULES:

  1. No extra commentary, code, or explanations are allowed outside these sections.

  2. Always use plain text. Do not include markdown, backticks, or other formatting.

  3. Your output is meant to be **readable by both humans and the agent script**. An agent will parse the sections to validate and execute the plan.

  4. If the user request is ambiguous or under specified, you MUST ask clarifying questions instead of producing a proposal.
  `

  let spec
  
  try {
    const response = await askPlanner(prompt)
    spec = JSON.parse(response)
  } catch (err) {
    return {
      ...state,
      errors: [...state.errors, "Failed to generate or parse component spec"],
      step: "GENERATE_SPEC",
    }
  }

  return {
    ...state,
    componentSpec: spec,
    step: "REVIEW_SPEC",
  }
}

export async function reviewSpec(
  state: AgentState
): Promise<AgentState> {
  console.log("\n=== COMPONENT SPEC ===")
  console.log(JSON.stringify(state.componentSpec, null, 2))
  console.log("======================\n")

  const answer = await ask(
    "Approve spec? (y = approve / r = regenerate): "
  )

  if (answer.toLowerCase() !== "y") {
    return {
      ...state,
      step: "GENERATE_SPEC",
    }
  }

  const nextState: AgentState = {
    ...state,
    specApproved: true,
    step: "GENERATE_CODE",
  }

  checkpoint("SPEC_APPROVED", nextState)

  return nextState
}

export async function generateCode(
  state: AgentState
): Promise<AgentState> {

  console.log("→ GENERATE_CODE")
  if (!state.specApproved || !state.componentSpec) {
    throw new Error("Cannot generate code without an approved spec")
  }

  const spec = state.componentSpec

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

  try {
    code = await askCoder(prompt)
    const normalizedCode = normalizeCode(code)
    code = normalizedCode
  } catch {
    return {
      ...state,
      errors: [...state.errors, "Code generation failed"],
      step: "GENERATE_CODE",
    }
  }

  return {
    ...state,
    generatedCode: code,
    step: "REVIEW_CODE",
  }
}

export async function validateCode(state: AgentState): Promise<AgentState>{

  console.log("→ VALIDATE_CODE")
  
  if(!state.generatedCode || !state.componentSpec) throw new Error("No code to validate.")
  if(state.validationAttempts > 3){
    return {
      ...state,
      step: "REVIEW_CODE",
      exitReason:'VALIDATION_RETRIES_EXHAUSTED'
    }
  }
  const cleanedCode = normalizeCode(state.generatedCode)  

  if(isValid(cleanedCode,state.componentSpec.name)){
    return {
      ...state,
      generatedCode: cleanedCode,
      step:'REVIEW_CODE',
      exitReason:"VALIDATION_PASSED"
    }
  }
  
  const errors: string[] = []
  if(!cleanedCode.includes('export')) errors.push('Missing export statement')
  if(!cleanedCode.includes(state.componentSpec.name)) errors.push('Component name changed or is missing.')
  if(cleanedCode.includes('```')) errors.push('Code was fenced in by ```')
  
  return {
    ...state,
    validationAttempts:state.validationAttempts + 1,
    validationHistory:[
      ...state.validationHistory,
      {
        attempt:state.validationAttempts + 1,
        errors
      }
    ],
    step:"FIX_CODE"
  }
}

export async function fixCode(state:AgentState): Promise<AgentState> {

  console.log("→ FIX_CODE")

  const attempt = state.validationAttempts
  if(state.validationHistory.at(-1)?.attempt !== attempt) {
    throw new Error(`There is a mismatch with the number of attempts and the attempt currently being fixed. State attempt: ${attempt} vs. Validation History attempt ${state.validationHistory.at(-1)?.attempt}`)

  }
  if(!state.generatedCode) {
    throw new Error("FIX_CODE called without generatedCode")
  }

  const prompt = `
    The following React + TypeScript component failed validation for these reasons:
  
    ${state.validationHistory[-1].errors.map((e) => "- " + e).join("\n")}
  
    Fix the component:
    - Do not change the component name
    - Do not change props
    - Remove fences
    - Return ONLY code
  
    ${normalizeCode(state.generatedCode)}
  `
  
  try {
    const regeneratedCode = await askCoder(prompt)
    const normalizedCode = normalizeCode(regeneratedCode)
    return {
      ...state,
      generatedCode: normalizedCode,
      step:'VALIDATE_CODE'
    }
  } catch (err) {
    return {
      ...state,
      errors: [...state.errors, "FIX_CODE execution failed"],
      step: "REVIEW_CODE",
      exitReason:"FIX_CODE_FAILED"
    }
  }
}  

export async function reviewCode(
  state: AgentState
): Promise<AgentState> {
  console.log("\n=== GENERATED CODE ===\n")
  console.log(state.generatedCode)
  console.log("\n======================\n")

  console.log("→ REVIEW_CODE", state.exitReason)
  
  const answer = await ask(
    "Approve code? (y = approve / r = retry code): "
  )

  // 🔁 Retry → rollback to approved spec MCP
  if (answer.toLowerCase() !== "y") {
    console.log("↩ Rolling back to approved spec")
    return restore("SPEC_APPROVED")
  }

  return {
    ...state,
    codeApproved: true,
    step: "WRITE_FILE",
  }
}

export async function writeFile(
  state: AgentState
): Promise<AgentState> {
  console.log("→ WRITE_FILE")

  if (!state.codeApproved || !state.generatedCode || !state.componentSpec) {
    throw new Error("Cannot write file without approved code and spec")
  }

  // Define filename based on component name
  const fileName = `${state.componentSpec.name}.tsx`
  const filePath = path.join(process.cwd(), fileName)

  // Check if file already exists
  if (fs.existsSync(filePath)) {
    const existing = fs.readFileSync(filePath, "utf-8")

    if (existing === state.generatedCode) {
      console.log("File already up-to-date, skipping write.")
      return { ...state, step: "DONE" }
    }

    console.log(`File ${fileName} exists. Showing diff:`)
    console.log("--- EXISTING ---")
    console.log(existing)
    console.log("--- NEW ---")
    console.log(state.generatedCode)

    // const proceed = await new Promise<string>((resolve) => {
    //   const rl = require("readline").createInterface({
    //     input: process.stdin,
    //     output: process.stdout,
    //   })
    //   rl.question("Overwrite file? (y = yes / n = skip): ", (answer:string) => {
    //     rl.close()
    //     resolve(answer.trim())
    //   })
    // })

    const proceed = await ask('Overwrite file? (y = yes / n = skip): ')

    if (proceed.toLowerCase() !== "y") {
      console.log("Skipping file write.")
      return { ...state, step: "DONE" }
    }
  }

  // Write file
  fs.writeFileSync(filePath, state.generatedCode, "utf-8")
  console.log(`File written: ${fileName}`)

  return { ...state, step: "DONE" }
}