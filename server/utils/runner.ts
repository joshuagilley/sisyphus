import vm from "node:vm"
import type { Problem, TestResult } from "./types"

const MAX_RUNTIME_MS = 1000

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null

const deepEqual = (a: unknown, b: unknown): boolean => {
  if (Object.is(a, b)) {
    return true
  }

  if (Number.isNaN(a) && Number.isNaN(b)) {
    return true
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false
    }
    return a.every((item, index) => deepEqual(item, b[index]))
  }

  if (isObject(a) && isObject(b)) {
    const keysA = Object.keys(a)
    const keysB = Object.keys(b)
    if (keysA.length !== keysB.length) {
      return false
    }
    return keysA.every((key) => deepEqual(a[key], b[key]))
  }

  return false
}

const compileUserFunction = (problem: Problem, solutionBody: string) => {
  const fnSource = `
    "use strict";
    function ${problem.functionName}(${problem.params.join(", ")}) {
      ${solutionBody}
    }
    module.exports = ${problem.functionName};
  `

  const context = vm.createContext({
    module: { exports: null as null | ((...args: unknown[]) => unknown) }
  })
  const script = new vm.Script(fnSource)
  script.runInContext(context, { timeout: MAX_RUNTIME_MS })

  const fn = context.module.exports
  if (typeof fn !== "function") {
    throw new Error("Solution did not export a function.")
  }

  return fn
}

export const runSolution = (
  problem: Problem,
  solutionBody: string
): { passedAll: boolean; results: TestResult[] } => {
  const results: TestResult[] = []
  let passedAll = true

  const fn = compileUserFunction(problem, solutionBody)

  for (const testCase of problem.testCases) {
    try {
      const actual = fn(...testCase.input)
      const passed = deepEqual(actual, testCase.expected)
      if (!passed) {
        passedAll = false
      }
      results.push({
        input: testCase.input,
        expected: testCase.expected,
        actual,
        passed
      })
    } catch (error) {
      passedAll = false
      results.push({
        input: testCase.input,
        expected: testCase.expected,
        actual: null,
        passed: false,
        error: error instanceof Error ? error.message : "Unknown error"
      })
    }
  }

  return { passedAll, results }
}
