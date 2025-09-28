import { useState } from "react";
import Display from "./Display";
import Keys from "./Keys";

const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [error, setError] = useState(false);
  const [angleMode, setAngleMode] = useState("deg");

  const inputNumber = (num) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? String(num) : display + num);
    }
    setError(false);
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
    setError(false);
  };

  const inputConstant = (constant) => {
    let value;
    switch (constant) {
      case "pi":
        value = Math.PI;
        break;
      case "e":
        value = Math.E;
        break;
      default:
        return;
    }
    setDisplay(String(value));
    setWaitingForOperand(true);
    setError(false);
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    setError(false);
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
    setError(false);
  };

  const toggleAngleMode = () => {
    setAngleMode(angleMode === "deg" ? "rad" : "deg");
  };

  const toRadians = (value) => {
    return angleMode === "deg" ? value * (Math.PI / 180) : value;
  };

  const fromRadians = (value) => {
    return angleMode === "deg" ? value * (180 / Math.PI) : value;
  };

  const factorial = (n) => {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const performPlusMinus = () => {
    const currentValue = parseFloat(display);
    if (!isNaN(currentValue) && currentValue !== 0) {
      const newValue = -currentValue;
      setDisplay(String(newValue));
      setError(false);
    }
  };

  const performPercent = () => {
    const currentValue = parseFloat(display);
    if (!isNaN(currentValue)) {
      const newValue = currentValue / 100;
      setDisplay(String(newValue));
      setWaitingForOperand(true);
      setError(false);
    }
  };

  const performScientificOperation = (func) => {
    const inputValue = parseFloat(display);

    if (isNaN(inputValue)) {
      setError(true);
      setDisplay("Error");
      return;
    }

    let result;

    try {
      switch (func) {
        case "sqrt":
          if (inputValue < 0) {
            throw new Error("Invalid input");
          }
          result = Math.sqrt(inputValue);
          break;
        case "square":
          result = inputValue * inputValue;
          break;
        case "sin":
          result = Math.sin(toRadians(inputValue));
          break;
        case "cos":
          result = Math.cos(toRadians(inputValue));
          break;
        case "tan":
          result = Math.tan(toRadians(inputValue));
          break;
        case "asin":
          if (inputValue < -1 || inputValue > 1) {
            throw new Error("Invalid input");
          }
          result = fromRadians(Math.asin(inputValue));
          break;
        case "acos":
          if (inputValue < -1 || inputValue > 1) {
            throw new Error("Invalid input");
          }
          result = fromRadians(Math.acos(inputValue));
          break;
        case "atan":
          result = fromRadians(Math.atan(inputValue));
          break;
        case "log":
          if (inputValue <= 0) {
            throw new Error("Invalid input");
          }
          result = Math.log10(inputValue);
          break;
        case "ln":
          if (inputValue <= 0) {
            throw new Error("Invalid input");
          }
          result = Math.log(inputValue);
          break;
        case "factorial":
          if (
            inputValue < 0 ||
            !Number.isInteger(inputValue) ||
            inputValue > 170
          ) {
            throw new Error("Invalid input");
          }
          result = factorial(inputValue);
          break;
        case "reciprocal":
          if (inputValue === 0) {
            throw new Error("Division by zero");
          }
          result = 1 / inputValue;
          break;
        default:
          return;
      }

      if (isNaN(result) || !isFinite(result)) {
        throw new Error("Invalid result");
      }

      setDisplay(String(result));
      setWaitingForOperand(true);
      setError(false);
    } catch (error) {
      setError(true);
      setDisplay("Error");
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      if (newValue === null) {
        setError(true);
        setDisplay("Error");
        setPreviousValue(null);
        setOperation(null);
        setWaitingForOperand(true);
        return;
      }

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case "+":
        return firstValue + secondValue;
      case "-":
        return firstValue - secondValue;
      case "*":
        return firstValue * secondValue;
      case "/":
        if (secondValue === 0) {
          return null;
        }
        return firstValue / secondValue;
      case "power":
        return Math.pow(firstValue, secondValue);
      case "=":
        return secondValue;
      default:
        return secondValue;
    }
  };

  const handleClick = (e) => {
    const { name } = e.target;

    if (error && name !== "clear") {
      return;
    }

    switch (name) {
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        inputNumber(name);
        break;
      case ".":
        inputDecimal();
        break;
      case "+":
      case "-":
      case "*":
      case "/":
      case "=":
        performOperation(name);
        break;
      case "power":
        performOperation(name);
        break;
      case "sqrt":
      case "square":
      case "sin":
      case "cos":
      case "tan":
      case "asin":
      case "acos":
      case "atan":
      case "log":
      case "ln":
      case "factorial":
      case "reciprocal":
        performScientificOperation(name);
        break;
      case "pi":
      case "e":
        inputConstant(name);
        break;
      case "plusminus":
        performPlusMinus();
        break;
      case "percent":
        performPercent();
        break;
      case "clear":
        clear();
        break;
      case "backspace":
        backspace();
        break;
      case "angle-mode":
        toggleAngleMode();
        break;
      default:
        break;
    }
  };

  const formatDisplay = (value) => {
    if (value === "Error") return value;

    const num = parseFloat(value);
    if (isNaN(num)) return value;

    if (Math.abs(num) > 999999999 || (Math.abs(num) < 0.000001 && num !== 0)) {
      return num.toExponential(6);
    }

    return parseFloat(num.toFixed(10)).toString();
  };

  return (
    <div className="calculator">
      <Display
        display={formatDisplay(display)}
        error={error}
        operation={operation}
        previousValue={previousValue}
        angleMode={angleMode}
      />
      <Keys handleClick={handleClick} angleMode={angleMode} />
    </div>
  );
};

export default Calculator;
