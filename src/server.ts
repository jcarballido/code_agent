import { agent } from "./graph.js";
import { ask } from "./util/ask.js";

async function main() {

  while(true){
    console.log("---TASK STARTED---")
    const componentDescription = await ask("Describe the component you want to build (or exit):\n")
    if(componentDescription == 'exit') break
    
    const projectRoot = await ask("Project root path:\n")
    if(projectRoot == 'exit') break
  
    await agent.invoke({
      componentDescription,
      projectRoot,
      done:false,
      specificationRegenerationAttempts:0,
      codeRegenerationAttempts: 0,
      specificationHistory:[]
    })

    console.log("---TASK COMPLETE---")
  }

}

main()