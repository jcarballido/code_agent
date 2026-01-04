const findLine = (generatedProposal: string, startsWith: string): string => {
  const splitProposal = generatedProposal.split('\n')
  // lelt lineIndex = 0
  let start = 0
  let end = splitProposal.length - 1
  while(start < end && !splitProposal[start]?.trim().startsWith(startsWith) ) start++

  console.log('Line where while loop ended:')
  console.log(splitProposal[start] || 'Not found')
  
  return splitProposal[start] || 'Not found'
}

export default findLine