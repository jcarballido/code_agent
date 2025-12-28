type DynamicField = {
  componentName:string,
  props:string[],
  behaviors:string[],
}

// const dynamicFields: DynamicField = {
//   componentName:'',
//   props:{},
//   behaviors:[]
// }

// const formatProps = (propObject:DynamicField['props']) => {
//   const formattedProps: string[] = []
//   for(const propName in propObject){
//     const propType = propObject[propName]
//     const formattedProp = `- ${propName}: ${propType}\n`
//     formattedProps.push(formattedProp) 
//   }
//   return formattedProps
// } 

// const formattedProps = formatProps(dynamicFields.props)

// const formatBehaviors = (behaviors: DynamicField['behaviors']) => {
//   const formattedBehaviors = behaviors.map((behavior) => {
//     return `- ${behavior}\n`
//   })
//   return formattedBehaviors
// } 

// const formattedBehaviors = formatBehaviors(dynamicFields.behaviors)

const dynamicInput = (dynamicFields:DynamicField) => {
  
  const formatProps = (props:DynamicField['props']) => {
    const formattedProps = props.map((prop) => {
      return `- ${prop}\n`
    })
    return formattedProps
  } 

  const formattedProps = formatProps(dynamicFields.props)

  const formatBehaviors = (behaviors: DynamicField['behaviors']) => {
    const formattedBehaviors = behaviors.map((behavior) => {
      return `- ${behavior}\n`
    })
    return formattedBehaviors
  } 

  const formattedBehaviors = formatBehaviors(dynamicFields.behaviors)

  return `
    Create a React component with the following requirements:

    Component name: ${dynamicFields.componentName}

    Props:
    ${formattedProps.join("")}

    Behavior:
    ${formattedBehaviors.join("")}

    Output rules:
    - Output only TSX
    - One component only
  `
}
export default dynamicInput
export type {DynamicField}