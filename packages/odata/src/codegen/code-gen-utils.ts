/*
 * This module provides utility types and interfaces for code generation.
 * It includes definitions for various code constructs such as interfaces,
 * type aliases, constants, functions, classes, enums, and control flow statements.
 */

/**
 * Represents a single line of code as a string.
 */
export type TCoGeCodeLine = string

/**
 * Represents a code element which can be one of several types.
 * This type is a union of various possible code constructs.
 */
export type TCoGeCodeElement =
  | TCoGeCodeLine
  | TCoGeInterfaceDeclaration
  | TCoGeTypeAliasDeclaration
  | TCoGeConstantDeclaration
  | TCoGeArrowFunctionDeclaration
  | TCoGeClassDeclaration
  | TCoGeFunctionDeclaration
  | TCoGeEnumDeclaration
  | TCoGeIfStatement
  | TCoGeSwitchStatement
  | TCoGeForLoopStatement
  | TCoGeForOfLoopStatement

/**
 * 'if' statement in the code generation utility.
 */
export interface TCoGeIfStatement {
  type: 'if'
  condition: string
  /**
   * body of a code construct, which is an array of code elements.
   */
  body: TCoGeCodeElement[]
  /**
   * array of 'else if' blocks in an 'if' statement.
   */
  elseIfs?: TCoGeElseIfBlock[]
  /**
   * optional 'else' block in an 'if' statement.
   */
  else?: TCoGeElseBlock
}

/**
 * 'else if' block in an 'if' statement.
 */
export interface TCoGeElseIfBlock {
  condition: string
  body: TCoGeCodeElement[]
}

/**
 * 'else' block in an 'if' statement.
 */
export interface TCoGeElseBlock {
  body: TCoGeCodeElement[]
}

/**
 * Interface representing a 'switch' statement in the code generation utility.
 */
export interface TCoGeSwitchStatement {
  type: 'switch'
  expression: string
  cases: Record<string, TCoGeCodeElement[]>
  defaultCase?: TCoGeCodeElement[]
}

/**
 * Interface representing a 'for' loop statement in the code generation utility.
 */
export interface TCoGeForLoopStatement {
  type: 'for'
  /**
   * The initializer for the 'for' loop statement.
   * @example let i = 0
   */
  initializer: string
  /**
   * The condition for 'for' statement.
   * @example i < 10
   */
  condition: string
  /**
   * The incrementor for the 'for' loop statement.
   * @example i++
   */
  incrementor: string
  body: TCoGeCodeElement[]
}

/**
 * Interface representing a 'for...of' loop statement in the code generation utility.
 */
export interface TCoGeForOfLoopStatement {
  type: 'forOf'
  /**
   * Represents a string variable.
   * @example item
   */
  variable: string
  /**
   * Represents the iterable object in a 'for...of' loop statement.
   * @example items
   */
  iterable: string
  body: TCoGeCodeElement[]
}

/**
 * Interface representing an 'object' declaration in the code generation utility.
 */
export interface TCoGeObjectDeclaration {
  type: 'object'
  value: Record<string, TCoGeValueDeclaration>
}

/**
 * Interface representing an 'interface' declaration in the code generation utility.
 */
export interface TCoGeInterfaceDeclaration {
  type: 'interface'
  name: string
  value: Record<string, any>
  extends?: string[]
  exported?: boolean
}

/**
 * Interface representing a type alias declaration in the code generation utility.
 */
export interface TCoGeTypeAliasDeclaration {
  type: 'type'
  name: string
  value: string
  exported?: boolean
}

/**
 * Interface representing a constant declaration in the code generation utility.
 */
export interface TCoGeConstantDeclaration {
  type: 'const' | 'let' | 'var'
  name: string
  value: TCoGeValueDeclaration
  exported?: boolean
}

/**
 * Interface representing an arrow function declaration in the code generation utility.
 */
export interface TCoGeArrowFunctionDeclaration {
  type: 'arrowFunction'
  args: Record<string, string>
  returnType?: string
  body: TCoGeCodeElement[]
}

/**
 * Interface representing a function declaration in the code generation utility.
 */
export interface TCoGeFunctionDeclaration {
  type: 'function'
  name: string
  args: Record<string, string>
  returnType?: string
  body: TCoGeCodeElement[]
  exported?: boolean
}

/**
 * Interface representing a class declaration in the code generation utility.
 */
export interface TCoGeClassDeclaration {
  type: 'class'
  name: string
  extends?: string
  implements?: string[]
  props?: TCoGePropDeclaration[]
  methods?: TCoGeMethodDeclaration[]
  exported?: boolean
}

/**
 * Interface representing a class property declaration in the code generation utility.
 */
export interface TCoGePropDeclaration {
  name: string
  visibility?: 'public' | 'private' | 'protected'
  static?: boolean
  type?: string
  optional?: boolean
  value?: TCoGeValueDeclaration
}

/**
 * Interface representing a class method declaration in the code generation utility.
 */
export interface TCoGeMethodDeclaration {
  name: string
  visibility?: 'public' | 'private' | 'protected'
  static?: boolean
  args: Record<string, string>
  returnType?: string
  body?: TCoGeCodeElement[]
}

/**
 * Interface representing an enum declaration in the code generation utility.
 */
export interface TCoGeEnumDeclaration {
  type: 'enum'
  name: string
  members: (string | { name: string; value: string | number })[]
  exported?: boolean
}

/**
 * Represents a value declaration which can be a string, an object declaration, or an arrow function declaration.
 */
export type TCoGeValueDeclaration = string | TCoGeObjectDeclaration | TCoGeArrowFunctionDeclaration

/**
 * Generates code from an array of code elements.
 *
 * @param {TCoGeCodeElement[]} elements - The array of code elements to generate code from.
 * @param {number} [indentLevel=0] - The initial indentation level.
 * @returns {string} The generated code as a string.
 * @throws {Error} If an unknown code element type is encountered.
 */
export function codeGen(elements: TCoGeCodeElement[], indentLevel: number = 0): string {
  let code = ''
  for (const element of elements) {
    if (typeof element === 'string') {
      code += indent(indentLevel) + element + '\n'
    } else {
      switch (element.type) {
        case 'interface':
          code += generateInterface(element, indentLevel) + '\n'
          break
        case 'type':
          code += generateTypeAlias(element, indentLevel) + '\n'
          break
        case 'const':
          code += generateConstant(element, indentLevel) + '\n'
          break
        case 'arrowFunction':
          code += generateArrowFunction(element, indentLevel) + '\n'
          break
        case 'function':
          code += generateFunction(element, indentLevel) + '\n'
          break
        case 'class':
          code += generateClass(element, indentLevel) + '\n'
          break
        case 'enum':
          code += generateEnum(element, indentLevel) + '\n'
          break
        case 'if':
          code += generateIfStatement(element, indentLevel) + '\n'
          break
        case 'switch':
          code += generateSwitchStatement(element, indentLevel) + '\n'
          break
        case 'for':
          code += generateForLoop(element, indentLevel) + '\n'
          break
        case 'forOf':
          code += generateForOfLoop(element, indentLevel) + '\n'
          break
        default:
          throw new Error(`Unknown code element type: ${(element as any).type}`)
      }
    }
  }
  return code
}

/**
 * Generates an indentation string based on the given level.
 *
 * @param {number} level - The level of indentation.
 * @returns {string} A string containing spaces for indentation.
 */
function indent(level: number): string {
  return '  '.repeat(level)
}

function generateValue(value: TCoGeValueDeclaration, indentLevel: number): string {
  if (typeof value === 'string') {
    return value
  } else if (value.type === 'object') {
    return generateObject(value as TCoGeObjectDeclaration, indentLevel)
  } else if (value.type === 'arrowFunction') {
    return generateArrowFunction(value as TCoGeArrowFunctionDeclaration, indentLevel, true)
  } else {
    throw new Error(`Unsupported value type in generateValue: ${(value as any).type}`)
  }
}

function generateObject(decl: TCoGeObjectDeclaration, indentLevel: number): string {
  let code = '{\n'
  const entries = Object.entries(decl.value)
  entries.forEach(([key, val], index) => {
    code += indent(indentLevel + 1) + `${key}: ${generateValue(val, indentLevel + 1)}`
    if (index < entries.length - 1) {
      code += ',\n'
    } else {
      code += '\n'
    }
  })
  code += indent(indentLevel) + '}'
  return code
}

function generateArrowFunction(
  decl: TCoGeArrowFunctionDeclaration,
  indentLevel: number,
  isValueContext: boolean = false
): string {
  let code = ''
  if (!isValueContext) {
    code += indent(indentLevel)
  }
  const args = Object.entries(decl.args)
    .map(([argName, argType]) => `${argName}: ${argType}`)
    .join(', ')
  code += `(${args})`
  if (decl.returnType) {
    code += `: ${decl.returnType}`
  }
  code += ' => {\n'
  code += codeGen(decl.body, indentLevel + 1)
  code += indent(indentLevel) + '}'
  if (!isValueContext) {
    code += ';\n'
  }
  return code
}

function generateConstant(decl: TCoGeConstantDeclaration, indentLevel: number): string {
  let code = ''
  code += indent(indentLevel)
  if (decl.exported) {
    code += 'export '
  }
  code += `${decl.type} ${decl.name} = `
  code += generateValue(decl.value, indentLevel)
  code += ';\n'
  return code
}

function generateProp(decl: TCoGePropDeclaration, indentLevel: number): string {
  let code = ''
  const visibility = decl.visibility ? decl.visibility + ' ' : ''
  const isStatic = decl.static ? 'static ' : ''
  const optional = decl.optional ? '?' : ''
  const typeAnnotation = decl.type ? `: ${decl.type}` : ''
  code += indent(indentLevel) + `${visibility}${isStatic}${decl.name}${optional}${typeAnnotation}`
  if (decl.value !== undefined) {
    code += ' = ' + generateValue(decl.value, indentLevel)
  }
  code += ';\n'
  return code
}

function generateClass(decl: TCoGeClassDeclaration, indentLevel: number): string {
  let code = ''
  code += indent(indentLevel)
  if (decl.exported) {
    code += 'export '
  }
  code += `class ${decl.name}`
  if (decl.extends) {
    code += ` extends ${decl.extends}`
  }
  if (decl.implements && decl.implements.length > 0) {
    code += ` implements ${decl.implements.join(', ')}`
  }
  code += ' {\n'
  for (const prop of decl.props || []) {
    code += generateProp(prop, indentLevel + 1)
  }
  for (const method of decl.methods || []) {
    code += generateMethod(method, indentLevel + 1)
  }
  code += indent(indentLevel) + '}\n'
  return code
}

function generateIfStatement(decl: TCoGeIfStatement, indentLevel: number): string {
  let code = ''
  code += indent(indentLevel) + `if (${decl.condition}) {\n`
  code += codeGen(decl.body, indentLevel + 1)
  code += indent(indentLevel) + '}'

  if (decl.elseIfs) {
    for (const elseIf of decl.elseIfs) {
      code += ` else if (${elseIf.condition}) {\n`
      code += codeGen(elseIf.body, indentLevel + 1)
      code += indent(indentLevel) + '}'
    }
  }

  if (decl.else) {
    code += ' else {\n'
    code += codeGen(decl.else.body, indentLevel + 1)
    code += indent(indentLevel) + '}'
  }

  code += '\n'
  return code
}

function generateSwitchStatement(decl: TCoGeSwitchStatement, indentLevel: number): string {
  let code = ''
  code += indent(indentLevel) + `switch (${decl.expression}) {\n`

  for (const [caseValue, caseBody] of Object.entries(decl.cases)) {
    code += indent(indentLevel + 1) + `case ${caseValue}:\n`
    code += codeGen(caseBody, indentLevel + 2)
    code += indent(indentLevel + 2) + 'break;\n'
  }

  if (decl.defaultCase) {
    code += indent(indentLevel + 1) + 'default:\n'
    code += codeGen(decl.defaultCase, indentLevel + 2)
    code += indent(indentLevel + 2) + 'break;\n'
  }

  code += indent(indentLevel) + '}\n'
  return code
}

function generateForLoop(decl: TCoGeForLoopStatement, indentLevel: number): string {
  let code = ''
  code +=
    indent(indentLevel) + `for (${decl.initializer}; ${decl.condition}; ${decl.incrementor}) {\n`
  code += codeGen(decl.body, indentLevel + 1)
  code += indent(indentLevel) + '}\n'
  return code
}

function generateForOfLoop(decl: TCoGeForOfLoopStatement, indentLevel: number): string {
  let code = ''
  code += indent(indentLevel) + `for (const ${decl.variable} of ${decl.iterable}) {\n`
  code += codeGen(decl.body, indentLevel + 1)
  code += indent(indentLevel) + '}\n'
  return code
}

// Function to generate interface code
function generateInterface(decl: TCoGeInterfaceDeclaration, indentLevel: number): string {
  let code = ''
  code += indent(indentLevel)
  if (decl.exported) {
    code += 'export '
  }
  code += `interface ${decl.name}`
  if (decl.extends?.length) {
    code += ` extends ${decl.extends.join(', ')}`
  }
  code += ` {\n`
  code += generateInterfaceBody(decl.value, indentLevel + 1)
  code += indent(indentLevel) + '}\n'
  return code
}

function generateInterfaceBody(value: Record<string, any>, indentLevel: number): string {
  let code = ''
  for (const [propName, propValue] of Object.entries(value)) {
    if (typeof propValue === 'string') {
      code += indent(indentLevel) + `${propName}: ${propValue};\n`
    } else if (typeof propValue === 'object') {
      code += indent(indentLevel) + `${propName}: {\n`
      code += generateInterfaceBody(propValue, indentLevel + 1)
      code += indent(indentLevel) + '};\n'
    } else {
      throw new Error(`Unsupported property value type: ${typeof propValue}`)
    }
  }
  return code
}

function generateTypeAlias(decl: TCoGeTypeAliasDeclaration, indentLevel: number): string {
  let code = ''
  code += indent(indentLevel)
  if (decl.exported) {
    code += 'export '
  }
  code += `type ${decl.name} = ${decl.value};\n`
  return code
}

function generateFunction(decl: TCoGeFunctionDeclaration, indentLevel: number): string {
  let code = ''
  code += indent(indentLevel)
  if (decl.exported) {
    code += 'export '
  }
  const args = Object.entries(decl.args)
    .map(([argName, argType]) => `${argName}: ${argType}`)
    .join(', ')
  code += `function ${decl.name}(${args})`
  if (decl.returnType) {
    code += `: ${decl.returnType}`
  }
  code += ' {\n'
  code += codeGen(decl.body, indentLevel + 1)
  code += indent(indentLevel) + '}\n'
  return code
}

function generateMethod(decl: TCoGeMethodDeclaration, indentLevel: number): string {
  let code = ''
  const visibility = decl.visibility ? decl.visibility + ' ' : ''
  const isStatic = decl.static ? 'static ' : ''
  const args = Object.entries(decl.args)
    .map(([argName, argType]) => `${argName}: ${argType}`)
    .join(', ')
  code += indent(indentLevel) + `${visibility}${isStatic}${decl.name}(${args})`
  if (decl.returnType && decl.name !== 'constructor') {
    code += `: ${decl.returnType}`
  }
  if (decl.body) {
    code += ' {\n'
    code += codeGen(decl.body, indentLevel + 1)
    code += indent(indentLevel) + '}\n'
  } else {
    code += ';\n'
  }
  return code
}

function generateEnum(decl: TCoGeEnumDeclaration, indentLevel: number): string {
  let code = ''
  code += indent(indentLevel)
  if (decl.exported) {
    code += 'export '
  }
  code += `enum ${decl.name} {\n`
  for (const member of decl.members) {
    if (typeof member === 'string') {
      code += indent(indentLevel + 1) + `${member},\n`
    } else {
      code += indent(indentLevel + 1) + `${member.name} = ${member.value},\n`
    }
  }
  code += indent(indentLevel) + '}\n'
  return code
}
