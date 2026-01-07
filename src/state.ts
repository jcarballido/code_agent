import { Annotation } from "@langchain/langgraph";

export const AgentState = Annotation.Root({
  task: Annotation<string>(),
  plan: Annotation<{ steps: string[] | undefined }>(),
  done: Annotation<boolean>()
})

export type AgentStateType = typeof AgentState.State