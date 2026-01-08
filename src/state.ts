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
  done: Annotation<boolean>(),
  error:Annotation<string>(),
  specRegenerationAttempts: Annotation<number>()
})

export type AgentStateType = typeof AgentState.State