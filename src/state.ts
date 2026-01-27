// import { Annotation } from "@langchain/langgraph";
import { StateSchema } from "@langchain/langgraph";
import * as z from 'zod'

const Specification = z.object({
  name: z.string(),
  props: z.array(z.object({name: z.string(),type: z.string()})),
  responsibilities: string[],
  stylingNotes: string[]   
})

const State = new StateSchema({
  componentDescription: z.string(),
  projectRoot: z.string(),
  specification: z.
})

// export const AgentState = Annotation.Root({
//   componentDescription: Annotation<string>(),
//   projectRoot: Annotation<string>(),
//   spec: Annotation<Spec>(),
//   specHistory: Annotation<Spec[]>(),
//   specFeedback:Annotation<string | undefined>(),
//   specApproved: Annotation<boolean>(),
//   specRegenerationAttempts: Annotation<number>(),
//   generatedCode: Annotation<string>(),
//   generatedCodeHistory: Annotation<string[]>(),
//   generateCodeFeedback: Annotation<string>(),
//   codeValidated: Annotation<boolean>(),
//   codeApproved: Annotation<boolean>(),
//   codeRegenerationAttempts: Annotation<number>(),
//   error:Annotation<string[]>(),
//   done: Annotation<boolean>(),
//   exited:Annotation<{
//     "status":boolean
//   }>()
// })

export type AgentStateType = typeof AgentState.State
