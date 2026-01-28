// import { Annotation } from "@langchain/langgraph";
import { StateSchema } from "@langchain/langgraph";
import * as z from 'zod'

const Specification = z.object({
  name: z.string(),
  props: z.union([z.array(z.object({name: z.string(),type: z.string()})),z.undefined()]),
  responsibilities: z.array(z.string()),
  stylingNotes: z.array(z.string())
})

export const agentState = new StateSchema({
  initialIntent: z.string(),
  projectRoot: z.string(),
  specification: Specification,
  specificationHistory: z.array(Specification),
  specificationFeedback: z.union([z.string(),z.undefined()]),
  specificationApproval: z.boolean(),
  specificationRegenerationAttempts: z.number(),
  generatedCode: z.string(),
  generatedCodeHistory: z.array(z.string()),
  generatedCodeFeedback: z.string(),
  codeValidated: z.boolean(),
  codeApproved: z.boolean(),
  codeRegenerationAttempts: z.number(),
  error: z.array(z.string()),
  done: z.boolean(),
  exited: z.object({
    status: z.boolean(),
    node: z.string()
  })
})

export type State = typeof agentState.State
export type Update = typeof agentState.Update

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

