import { readFileSync } from 'fs'
import {
  type Identifier,
  type Node,
  ScriptKind,
  ScriptTarget,
  type SourceFile,
  SyntaxKind,
  createSourceFile,
} from 'typescript'

// Check if identifier is a supported http method
const checkForMethod = (identifier: Identifier) =>
  Boolean(
    identifier?.escapedText?.match(
      /^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)$/,
    ),
  )

const traverseNode = (node: Node, sourceFile: SourceFile) => {
  console.log(node)
}

// GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
const traverseSourceFile = (sourceFile: SourceFile) => {
  // Go to syntaxList
  // - assumed to be first child for now
  const syntaxList = sourceFile.getChildAt(0, sourceFile)
  console.log(syntaxList.getChildCount(sourceFile))
  console.log(SyntaxKind[syntaxList.kind])

  syntaxList.getChildren(sourceFile).forEach((node) => {
    // Variable declaration
    if (node.kind === SyntaxKind.FirstStatement) {
      // export const GET =
      const identifier = (node
        ?.getChildAt(1, sourceFile)
        ?.getChildAt(1, sourceFile)
        ?.getChildAt(0, sourceFile)
        ?.getChildAt(0, sourceFile) ||
        // const GET =
        node
          ?.getChildAt(0, sourceFile)
          ?.getChildAt(1, sourceFile)
          ?.getChildAt(0, sourceFile)
          ?.getChildAt(0, sourceFile)) as Identifier

      // Ensure we have an accepted HTTP method
      if (checkForMethod(identifier)) {
        console.log(identifier.escapedText)
      }
    }
    // Function declaration
    else if (node.kind === SyntaxKind.FunctionDeclaration) {
      // export async function
      const identifier = node?.getChildAt(
        node?.getChildAt(1, sourceFile).kind === SyntaxKind.Identifier ? 1 : 2,
        sourceFile,
      ) as Identifier

      // Ensure we have an accepted HTTP method
      if (checkForMethod(identifier)) {
        console.log(identifier.escapedText)
        const requestType = node
          ?.getChildAt(4, sourceFile)
          ?.getChildAt(0, sourceFile)
          ?.getChildAt(2, sourceFile)

        console.log(SyntaxKind[requestType?.kind])
        console.log(requestType?.target)
      }
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
