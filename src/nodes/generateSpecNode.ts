import type { AgentStateType } from "../state.js";

export function generateSpecNode(state:AgentStateType):Partial<AgentStateType> {  
    console.log("→ GENERATE_SPEC")
    if (state.specApproved) {
    throw new Error("Spec is already approved and cannot be regenerated")
  }
    const prompt = `
    You are a senior frontend engineer generating production-quality React components.
  
    Given the following component description:
  
    "${state.componentDescription}"
  
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
      // const response = await askPlanner(prompt)
      const response = `
        {
          "name": "DummyComponentName",
          "props": [{ "name": "propName", "type": "string" }],
          "responsibilities": ["Handles image renderind","Handles Title rendering"],
          "stylingNotes": ["A little up", "A little left"]
        }      
      `      
      spec = JSON.parse(response)
      console.log(spec)
    } catch (err) {
      console.log('Error caught in generating spec:')
      console.log(err)
      return {
        error: "Failed to generate or parse component spec",
      }
    }
  
    return {
      spec
    }
} 