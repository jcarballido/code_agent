import { agent } from "./graph.js";
import { ask } from "./util/ask.js";

async function main() {

  const componentDescription = await ask("Describe the component you want to build.")

  const result = await agent.invoke({
    componentDescription,
    done:false,
    specRegenerationAttempts:0,
    codeRegenerationAttempts: 0,
    specHistory:[]
  })

  console.log("----RESULT----")
  console.log(result)
}

main()