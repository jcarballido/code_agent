import type { ParseProposal } from "../types.js"
import SYSTEM_PROMPT from '../coderRules.js'
import askDeepSeek from "./askDeepSeek.js"

const generateCode = (file:string, proposal: ParseProposal): Promise<string> => {
  return new Promise((resolve,reject) => {
    let coderPrompt: string
    const match = file.match(/^([^:]+):\s*(.+)$/) || '';

    const [, path, description] = match;

    if(typeof match !== 'string'){
      console.log('Path found: ', path)
      coderPrompt = SYSTEM_PROMPT + `
      Generate the contents of ${path}.

      Purpose:
      ${description}

      Constraints:
      - All code must be TypeScript React (TSX)
      - No styling or CSS frameworks included
      - Each file must be independent and compile without errors
      - All files must be placed under src/

      Context:
      This file is part of the following approved proposal:
      ${proposal}
      `
      askDeepSeek(coderPrompt)

    }else{
      console.log('Invalid format.')
    }

  })
}

export default generateCode