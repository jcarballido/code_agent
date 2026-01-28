import type { State, Update } from "../state.js";

export async function refineIntentNodee(state:State): Promise<Update> {
    
    if(!state.clarifyingQuestions) throw new Error("Refine intent node hit without clarifying questions.")
    
    return{

    }
}