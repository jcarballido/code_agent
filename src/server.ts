import { agent } from "./graph.js";
import { ask } from "./util/ask.js";

async function main() {

  while(true){
    console.log("---TASK STARTED---")
    const componentDescription = await ask("Describe the component you want to build (or exit):\n")
    if(componentDescription == 'exit') break
    
    let workingDirectory: string | undefined = undefined
    const projectRoot = await ask("Project root path:\n")
    if(projectRoot == 'exit') break
    if(projectRoot == '.'){
      workingDirectory = process.cwd()
      console.log(`Working directory set to:\n${workingDirectory}`,)
    }

    if(!workingDirectory){
      throw new Error("Working directory undefined.")
    }
  
    await agent.invoke({
      initialIntent: componentDescription,
      projectRoot: workingDirectory,
    })

    console.log("---TASK COMPLETE---")
  }

}

main()