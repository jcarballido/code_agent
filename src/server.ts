import { agent } from "./graph.js";
import { ask } from "./util/ask.js";

async function main() {

  console.log("---TASK STARTED---")
  
  let workingDirectory: string | undefined = undefined
  const projectRoot = await ask("Project root path ('.' for current working directory):\n")
  if(!projectRoot){
    console.log("No project root assigned.")
  }
  if(projectRoot == '.'){
    workingDirectory = process.cwd()
    console.log(`Working directory set to:\n${workingDirectory}`,)
  }

  if(!workingDirectory){
    throw new Error("Working directory undefined.")
  }

  try {
    await agent.invoke({
      projectRoot: workingDirectory,
    })
  } catch (error) {
    console.log("Error caught in taks:\n")
    console.log(error)
  }


  console.log("---TASK COMPLETE---")

}

main()