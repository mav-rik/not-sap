import { describe, it, expect } from 'vitest'
import { codeGen, type TCoGeCodeElement } from './code-gen-utils'
describe('codeGen Utilities', () => {
  it('should generate exported constants correctly', () => {
    const input: TCoGeCodeElement[] = [
      {
        type: 'const',
        name: 'myConstant',
        value: '42',
        exported: true,
      },
    ]

    const output = codeGen(input)
    expect(output.trim()).toBe('export const myConstant = 42;')
  })

  it('should generate constant with object value', () => {
    const input: TCoGeCodeElement[] = [
      {
        type: 'const',
        name: 'myConstant',
        value: {
          type: 'object',
          value: {
            prop1: 'value1',
            prop2: 'value2',
          },
        },
        exported: true,
      },
    ]

    const output = codeGen(input)
    expect(output.trim()).toBe(`export const myConstant = {
  prop1: value1,
  prop2: value2
};`)
  })

  it('should generate exported type aliases correctly', () => {
    const input: TCoGeCodeElement[] = [
      {
        type: 'type',
        name: 'MyType',
        value: 'number | string',
        exported: true,
      },
    ]

    const output = codeGen(input)
    expect(output.trim()).toBe('export type MyType = number | string;')
  })

  it('should generate exported interfaces correctly', () => {
    const input: TCoGeCodeElement[] = [
      {
        type: 'interface',
        name: 'MyInterface',
        value: {
          prop1: 'string',
          prop2: 'number',
        },
        exported: true,
      },
    ]

    const output = codeGen(input)
    expect(output.trim()).toBe(
      `export interface MyInterface {
  prop1: string;
  prop2: number;
}`
    )
  })

  it('should generate exported functions correctly', () => {
    const input: TCoGeCodeElement[] = [
      {
        type: 'function',
        name: 'myFunction',
        args: {
          arg1: 'string',
          arg2: 'number',
        },
        returnType: 'void',
        body: ['console.log(arg1, arg2);'],
        exported: true,
      },
    ]

    const output = codeGen(input)
    expect(output.trim()).toBe(
      `export function myFunction(arg1: string, arg2: number): void {
  console.log(arg1, arg2);
}`
    )
  })

  it('should generate exported classes correctly', () => {
    const input: TCoGeCodeElement[] = [
      {
        type: 'class',
        name: 'MyClass',
        extends: 'BaseClass',
        implements: ['MyInterface'],
        methods: [
          {
            name: 'constructor',
            args: {
              arg1: 'string',
            },
            body: ['super(arg1);'],
          },
          {
            name: 'myMethod',
            visibility: 'public',
            args: {
              param: 'number',
            },
            returnType: 'void',
            body: ["console.log('Method called');"],
          },
        ],
        exported: true,
      },
    ]

    const output = codeGen(input)
    expect(output.trim()).toBe(
      `export class MyClass extends BaseClass implements MyInterface {
  constructor(arg1: string) {
    super(arg1);
  }
  public myMethod(param: number): void {
    console.log('Method called');
  }
}`
    )
  })

  it('should generate enums correctly', () => {
    const input: TCoGeCodeElement[] = [
      {
        type: 'enum',
        name: 'Colors',
        members: ['Red', 'Green', { name: 'Blue', value: 3 }],
        exported: true,
      },
    ]

    const output = codeGen(input)
    expect(output.trim()).toBe(`export enum Colors {
  Red,
  Green,
  Blue = 3,
}`)
  })

  it('should handle nested code elements correctly', () => {
    const input: TCoGeCodeElement[] = [
      {
        type: 'function',
        name: 'complexFunction',
        args: {},
        body: [
          {
            type: 'if',
            condition: 'true',
            body: ["console.log('Inside if');"],
          },
          {
            type: 'for',
            initializer: 'let i = 0',
            condition: 'i < 10',
            incrementor: 'i++',
            body: ['console.log(i);'],
          },
        ],
        exported: true,
      },
    ]

    const output = codeGen(input)
    expect(output.trim()).toBe(
      `export function complexFunction() {
  if (true) {
    console.log('Inside if');
  }

  for (let i = 0; i < 10; i++) {
    console.log(i);
  }

}`
    )
  })

  it('should handle non-exported elements correctly', () => {
    const input: TCoGeCodeElement[] = [
      {
        type: 'const',
        name: 'internalConstant',
        value: "'not exported'",
      },
    ]

    const output = codeGen(input)
    expect(output.trim()).toBe(`const internalConstant = 'not exported';`)
  })

  it('should generate arrow functions correctly', () => {
    const input: TCoGeCodeElement[] = [
      {
        type: 'arrowFunction',
        args: {
          arg1: 'string',
        },
        returnType: 'number',
        body: ['return arg1.length;'],
      },
    ]

    const output = codeGen(input)
    expect(output.trim()).toBe(
      `(arg1: string): number => {
  return arg1.length;
};`
    )
  })

  it('should generate code with multiple elements correctly', () => {
    const input: TCoGeCodeElement[] = [
      {
        type: 'const',
        name: 'myConstant',
        value: '42',
        exported: true,
      },
      {
        type: 'type',
        name: 'MyType',
        value: 'number | string',
        exported: true,
      },
      {
        type: 'interface',
        name: 'MyInterface',
        value: {
          prop1: 'string',
          prop2: 'MyType',
        },
        exported: true,
      },
      {
        type: 'function',
        name: 'myFunction',
        args: {
          arg1: 'string',
          arg2: 'MyType',
        },
        returnType: 'void',
        body: ['console.log(arg1, arg2);'],
        exported: true,
      },
    ]

    const output = codeGen(input)
    const expectedOutput = `export const myConstant = 42;

export type MyType = number | string;

export interface MyInterface {
  prop1: string;
  prop2: MyType;
}

export function myFunction(arg1: string, arg2: MyType): void {
  console.log(arg1, arg2);
}

`
    expect(output).toBe(expectedOutput)
  })

  it('should generate correct code for forOf loop block', () => {
    const input: TCoGeCodeElement[] = [
      {
        type: 'forOf',
        variable: 'item',
        iterable: 'items',
        body: ['console.log(item);'],
      },
    ]

    const output = codeGen(input)
    const expectedOutput = `for (const item of items) {
  console.log(item);
}

`
    expect(output).toBe(expectedOutput)
  })
})
