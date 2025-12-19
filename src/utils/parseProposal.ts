interface ParseProposal{
  title:string,
  // description:string,
  // files:string[],
  // constraints: string[]
}

export default function parseProposal(buffer:string): ParseProposal{
  const parsedProposal = {
    title:'',
    // description:'',
    // files:[],
    // constraints:[]
  }

  const splitBufferByLine = buffer.split('\n')
  let i = 0
  const currentLine = () => {
    return splitBufferByLine[i]
  }

  while(i < splitBufferByLine.length && currentLine() !== '=== PROPOSAL START ==='){
    i++
  }
  if(i == splitBufferByLine.length){
    throw new Error('Missing === PROPOSAL START ===')
  }

  i++

  if(currentLine() !== 'TITLE:' && currentLine() !== ''){
    throw new Error('Missing TITLE header.')
  }
  i++

  let titleLines = [] 
  while(i < splitBufferByLine.length && currentLine() !== 'DESCRIPTION:'){
    titleLines.push(currentLine())
    i++
  }
  const titleJoined = titleLines.join(' ').trim()
  parsedProposal.title = titleJoined

  return parsedProposal
}