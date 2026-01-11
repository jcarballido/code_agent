import { Annotation } from "@langchain/langgraph";

export type Spec = {
  name: string,
  props: {name: string,type: string}[] | undefined,
  responsibilities: string[],
  stylingNotes: string[]   
}

export const AgentState = Annotation.Root({
  componentDescription: Annotation<string>(),
  spec: Annotation<Spec>(),
  specHistory: Annotation<Spec[]>(),
  specFeedback:Annotation<string | undefined>(),
  specApproved: Annotation<boolean>(),
  specRegenerationAttempts: Annotation<number>(),
  generatedCode: Annotation<string>(),
  generatedCodeHistory: Annotation<string[]>(),
  generateCodeFeedback: Annotation<string>(),
  codeValidated: Annotation<boolean>(),
  codeApproved: Annotation<boolean>(),
  codeRegenerationAttempts: Annotation<number>(),
  error:Annotation<string[]>(),
  done: Annotation<boolean>(),
})

export type AgentStateType = typeof AgentState.State
