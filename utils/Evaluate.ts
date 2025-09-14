function evaluate(expression: string): number {
  expression = expression.replace(/\s+/g, '');

  const tokens = expression.match(/(\d+\.?\d*|\+|\-|\*|\/)/g);
  if (!tokens) return NaN;

  const outputQueue: string[] = [];
  const operatorStack: string[] = [];

  const precedence: Record<string, number> = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
  };

  const applyOperator = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return a / b;
      default: throw new Error(`Unknown operator: ${op}`);
    }
  };

  // Convert to Reverse Polish Notation
  for (const token of tokens) {
    if (!isNaN(Number(token))) {
      outputQueue.push(token);
    } else {
      while (
        operatorStack.length > 0 &&
        precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]
      ) {
        outputQueue.push(operatorStack.pop() as string);
      }
      operatorStack.push(token);
    }
  }

  while (operatorStack.length > 0) {
    outputQueue.push(operatorStack.pop() as string);
  }

  // Evaluate RPN
  const stack: number[] = [];
  for (const token of outputQueue) {
    if (!isNaN(Number(token))) {
      stack.push(Number(token));
    } else {
      const b = stack.pop();
      const a = stack.pop();
      if (a === undefined || b === undefined) {
        throw new Error("Invalid expression");
      }
      const result = applyOperator(a, b, token);
      stack.push(result);
    }
  }

  return stack[0];
}
export default evaluate;