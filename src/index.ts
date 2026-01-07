import { agent } from "./graph.js";

async function main() {
  const result = await agent.invoke({
    task:"Test graph",
    plan: {steps: undefined},
    done:false
  })

  console.log("----RESULT----")
  console.log(result)
}

main()