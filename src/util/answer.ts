import { ask } from "./ask.js";

export async function answer(questions: string[]): Promise<{question:string,response:string}[]> {
  const answers: {question:string,response:string}[] = []
  for(const q in questions){
    const response = await ask(q)
    answers.push({question:q, response})
  }
  return answers
}