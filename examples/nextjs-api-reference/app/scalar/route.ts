import { readFileSync } from 'fs'
import {
  type Node,
  ScriptKind,
  ScriptTarget,
  type SourceFile,
  SyntaxKind,
  createSourceFile,
  forEachChild,
} from 'typescript'

const traverseNode = (node: Node, sourceFile: SourceFile) => {
  console.log(node)
}

const traverseSourceFile = (sourceFile: SourceFile) => {
  // Go to syntaxList
  // - assumed to be first child for now
  const syntaxList = sourceFile.getChildAt(0, sourceFile)
  console.log(syntaxList.getChildCount(sourceFile))
  console.log(SyntaxKind[syntaxList.kind])

  syntaxList.getChildren(sourceFile).forEach((node) => {
    const child = node.getChildAt(0, sourceFile).getChildAt(0, sourceFile)

    if (child.kind === SyntaxKind.ExportKeyword) {
      console.log('we got ourselves an exports')
    }
  })
}

// From file path we get the path + url params
// We want all top level export methods
// - with request type / query params
// - need body params/types etc
// - with jsDoc
// Then all returns
// - get return type with status
// -

export const GET = () => {
  // Just do one file for now
  const fileName = './app/test/route.ts'

  const sourceFile = createSourceFile(
    fileName,
    readFileSync(fileName).toString(),
    ScriptTarget.Latest,
    // setParentNodes
    false,
    ScriptKind.TS,
  )

  console.log('=====')
  traverseSourceFile(sourceFile)

  return Response.json({ nada: true })
}
