import type { AgentStateType } from "../state.js"

const CODE_MODEL = 'qwen2.5-coder:7b'
const PROPOSAL_MODEL = 'llama3.1'
const SPEC_GENERATOR_PROMPT = (componentDescription: string) => `
  You are a senior frontend engineer generating production-quality React components.

  Given the following component description:

  "${componentDescription}"

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

const SPEC_REVISION_GENERATOR_PROMPT = (description:AgentStateType["componentDescription"], previousSpec:AgentStateType["specHistory"], feedback:AgentStateType["specFeedback"]) => `
  Original user description:
  ${description}

  Previous spec:
  ${JSON.stringify(previousSpec[previousSpec.length - 1])}

  User feedback:
  ${feedback}

  Return ONLY valid JSON with this shape:

  {
    "name": "ComponentName",
    "props": [{ "name": "propName", "type": "string" }],
    "responsibilities": ["..."],
    "stylingNotes": ["..."]
  }

  RULES:

  1. Generate an updated spec that incorporates the feedback.

  2. Preserve unchanged decisions where possible.

  3. Return ONLY valid JSON in the same shape.

  5. No extra commentary, code, or explanations are allowed outside these sections.
  
  6. Always use plain text. Do not include markdown, backticks, or other formatting.
  
  7. Your output is meant to be **readable by both humans and the agent script**. An agent will parse the sections to validate and execute the plan.
`

const CODE_GENERATOR_PROMPT = (spec: AgentStateType["spec"]) => `  
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

const CODE_REGENERATION_PROMPT = (spec: AgentStateType["spec"],generatedCode: AgentStateType["generatedCode"], feedback: AgentStateType["generateCodeFeedback"]) => `
  You are modifying an existing React + TypeScript component.

  Approved spec (DO NOT VIOLATE):
  ${JSON.stringify(spec)}

  Current implementation:
  ${JSON.stringify(generatedCode)}

  Feedback to address:
  ${JSON.stringify(feedback)}

  Rules:
  - Do NOT change component name
  - Do NOT change public props
  - Do NOT add new features
  - Modify ONLY what is necessary to address feedback
  - Output ONLY valid TSX
  - Do NOT include explanations, markdown, or comments about the task.
  - Generate exactly one React component per response.
  - Use TypeScript with explicit, strongly typed props.
  - Use Tailwind CSS utility classes for layout, spacing, typography, and responsiveness.
  - Prefer semantic HTML.
  - Components must be realistic, usable, and visually structured.
  - Avoid placeholder divs and generic templates.
  - Do not invent files or directories.
  - Code must compile without errors.
  - Follow the provided proposal exactly.

  STYLE GUIDELINES:
  - Use flex/grid where appropriate.
  - Use sensible spacing (padding, margin, gap).
  - Use readable typography defaults.
  - Favor composition over minimalism.
  - If prop requirements are underspecified, infer reasonable types and structure.
  - Do NOT create your own custom classes

  Generate a React + TypeScript component.
  - Use TailwindCSS
  - Export the component
  - Do NOT include explanations
  - Return ONLY code
`

export {
  CODE_MODEL,
  PROPOSAL_MODEL,
  SPEC_GENERATOR_PROMPT,
  SPEC_REVISION_GENERATOR_PROMPT,
  CODE_GENERATOR_PROMPT,
  CODE_REGENERATION_PROMPT
}