import { SPEC_REFINING_PROMPT, SPEC_REVISION_GENERATOR_PROMPT } from "../constants/constants.js";
import type { State, Update } from "../state.js";
import askPlanner from "../util/askSpecGenerator.js";

export async function refineIntentNodee(state:State): Promise<Update> {
    
    if(!state.clarifyingQuestions) throw new Error("MISSING clarifying questions in refineIntentNode.")

    const clarifyingQandA = await answer(state.clarifyingQuestions)

    const prompt = SPEC_REFINING_PROMPT(state.initialIntent, clarifyingQandA)
        
    try {
        const reponse = await askPlanner(prompt)
    } catch (error) {
        
    }
    
}