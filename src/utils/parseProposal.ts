type ParseProposal = {
  title:string,
  description:string,
  files:string[],
  constraints: string[],
  errors:string[]
}

function isKeyofParsedProposal(key:string, typedObject: ParseProposal): key is keyof ParseProposal{
  return key in typedObject
}

export default function parseProposal(buffer:string): ParseProposal{
  const parsedProposal: ParseProposal = {
    title:'',
    description:'',
    files:[],
    constraints:[],
    errors: []
  }
  
  const splitBufferByLine = buffer.split('\n')
  let i = 0
  
  const currentLine = () => {
    return splitBufferByLine[i]?.trim()
  }

  const singleStringContentExtraction = (startHeader:string, exitHeader:string) => {
    if(currentLine() !== startHeader && currentLine() !== ''){
      parsedProposal.errors.push(`Missing ${startHeader} header.`)
    }
    i++
    let contentLines = [] 
    while(i < splitBufferByLine.length && currentLine() !== exitHeader){
      if(currentLine() !== startHeader){ 
        contentLines.push(currentLine())
      }
      i++
    }
    const contentLinesJoined = contentLines.join(' ').trim()
    if(contentLinesJoined == '') parsedProposal.errors.push(`Missing ${startHeader} data`)

    const startHeaderConverted = startHeader.toLowerCase().replace(':','')

    if(isKeyofParsedProposal(startHeaderConverted,parsedProposal)){
      if(startHeaderConverted == 'title' || startHeaderConverted == 'description'){
        parsedProposal[startHeaderConverted] = contentLinesJoined        
      }
    }
  }
  const arrayContentExtraction = (startHeader:string, exitHeader:string) => {
    const startHeaderConverted = startHeader.toLowerCase().replace(':','')
    while(i < splitBufferByLine.length && currentLine() !== exitHeader ){
      if(currentLine() !== startHeader && currentLine() !== ''){
        const lineData = currentLine()
        const path = lineData?.match(/^-\s(.*):?/) || ''
        if(isKeyofParsedProposal(startHeaderConverted, parsedProposal)){
          if(startHeaderConverted == 'files' || startHeaderConverted == 'constraints'){
            if(path[1]){
              parsedProposal[startHeaderConverted].push(path[1] || '') 
            }
          }
        }
      }
      i++
    }
    if(isKeyofParsedProposal(startHeaderConverted,parsedProposal)){
      if(startHeaderConverted == 'files'){
        if(parsedProposal[startHeaderConverted].length == 0) parsedProposal.errors.push(`Missing ${startHeaderConverted} data.`)
      }
    }
    if(parsedProposal.files.length == 0) parsedProposal.errors.push('Missing file path data')
  }

  while(i < splitBufferByLine.length && currentLine() !== '=== PROPOSAL START ==='){
    i++
  }
  if(i == splitBufferByLine.length){
    // throw new Error('Missing === PROPOSAL START ===')
    parsedProposal.errors.push('Missing === PROPOSAL START ====')
  }
  i++
  if(currentLine() !== 'TITLE:' && currentLine() !== ''){
    parsedProposal.errors.push('Missing TITLE header.')
  }
  i++
  singleStringContentExtraction('TITLE:','DESCRIPTION:')
  singleStringContentExtraction('DESCRIPTION:','FILES:')
  arrayContentExtraction('FILES:','CONSTRAINTS:')
  arrayContentExtraction('CONSTRAINTS:','=== PROPOSAL END ===')

  if(i > splitBufferByLine.length) parsedProposal.errors.push("Missing === PROPOSAL END ===")
  
  return parsedProposal
}















