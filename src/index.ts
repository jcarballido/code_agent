import { agent } from "./graph.js";

async function main() {
  const result = await agent.invoke({
    componentDescription:"Test graph",
    done:false,
    specRegenerationAttempts:0,
    codeRegenerationAttempts: 0
  })

  console.log("----RESULT----")
  console.log(result)
}

main()