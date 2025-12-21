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
//
  singleStringContentExtraction('TITLE:','DESCRIPTION:')
  // let titleLines = [] 
  // while(i < splitBufferByLine.length && currentLine() !== 'DESCRIPTION:'){
  //   if(currentLine() !== 'TITLE:'){ 
  //     titleLines.push(currentLine())
  //   }
  //   i++
  // }
  // const titleJoined = titleLines.join(' ').trim()
  // if(titleJoined == '') parsedProposal.errors.push('Missing title data')

  // parsedProposal.title = titleJoined
//
  singleStringContentExtraction('DESCRIPTION:','FILES:')
  // let descriptionLines = []
  // while(i < splitBufferByLine.length && currentLine() !== 'FILES:' ){
  //   if(currentLine() !== 'DESCRIPTION:') descriptionLines.push(currentLine())
  //   i++
  // }
  // const descriptionJoined = descriptionLines.join(' ').trim()
  // if(descriptionJoined == '') parsedProposal.errors.push('Missing title data')
  // parsedProposal.description = descriptionJoined
//
  const arrayContentExtraction = (startHeader:string, exitHeader:string) => {
    const startHeaderConverted = startHeader.toLowerCase().replace(':','')
    while(i < splitBufferByLine.length && currentLine() !== exitHeader ){
      if(currentLine() !== startHeader && currentLine() !== ''){
        const lineData = currentLine()
        const path = lineData?.match(/^-\s(.*):/) || ''
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
      if(startHeaderConverted == 'files' || startHeaderConverted == 'constraints'){
        if(parsedProposal[startHeaderConverted].length == 0) parsedProposal.errors.push(`Missing ${startHeaderConverted} data.`)
      }
    }
    if(parsedProposal.files.length == 0) parsedProposal.errors.push('Missing file path data')
  }

  arrayContentExtraction('FILES:','CONSTRAINTS:')
  // while(i < splitBufferByLine.length && currentLine() !== 'CONSTRAINTS:' ){
  //   if(currentLine() !== 'FILES:' && currentLine() !== ''){
  //     const fileData = currentLine()
  //     console.log('File data: ',fileData)
  //     const path = fileData?.match(/^-\s(.*):/) || ''
  //     console.log('path data: ', path)
  //     parsedProposal.files.push(path[1] || '') 
  //   }
  //   i++
  // }
  // if(parsedProposal.files.length == 0) parsedProposal.errors.push('Missing file path data')
  arrayContentExtraction('CONSTRAINTS:','=== PROPOSAL END ===')
  // while(i < splitBufferByLine.length && currentLine() !== '=== PROPOSAL END ==='){
  //   if(currentLine() !== 'CONSTRAINTS:' && currentLine() !== '') {
  //     const constraintData = currentLine()
  //     console.log('Constraint: ', constraintData)
  //     const constraintLine = constraintData?.match(/^-\s(.*)/) || ''
  //     console.log('Captured constraint: ',constraintLine)
  //     parsedProposal.constraints.push(constraintLine[1] || '')
  //   }
  //   i++
  // }
  // if(parsedProposal.constraints.length == 0) parsedProposal.errors.push('Missing constraints')

  if(i > splitBufferByLine.length) parsedProposal.errors.push("Missing === PROPOSAL END ===")
  
  return parsedProposal

  
}

// - All code must be TypeScript React (TSX)
// - No styling or CSS frameworks included
// - Each file must be independent and compile without errors














