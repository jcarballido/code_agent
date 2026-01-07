import { Annotation } from "@langchain/langgraph";

type Spec = {
  name: "ComponentName",
  props: {name: string,type: string}[] | undefined,
  responsibilities: string[],
  stylingNotes: string[]   
}

export const AgentState = Annotation.Root({
  task: Annotation<string>(),
  spec: Annotation<Spec>(),
  specApproved: Annotation<boolean>(),
  done: Annotation<boolean>()
})

export type AgentStateType = typeof AgentState.State