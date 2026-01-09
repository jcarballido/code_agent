import { Annotation } from "@langchain/langgraph";

type Spec = {
  name: string,
  props: {name: string,type: string}[] | undefined,
  responsibilities: string[],
  stylingNotes: string[]   
}

export const AgentState = Annotation.Root({
  componentDescription: Annotation<string>(),
  spec: Annotation<Spec>(),
  specApproved: Annotation<boolean>(),
  generatedCode: Annotation<string>(),
  codeValidated: Annotation<boolean>(),
  codeApproved: Annotation<boolean>(),
  done: Annotation<boolean>(),
  error:Annotation<string[]>(),
  specRegenerationAttempts: Annotation<number>(),
  codeRegenerationAttempts: Annotation<number>()
})

export type AgentStateType = typeof AgentState.State
