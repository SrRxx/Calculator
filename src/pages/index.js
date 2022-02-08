import React, { useEffect, useRef, useState } from "react";
import "../css/init.index.css";

function Index() {
  const inputOperations = useRef(),
    operationsZone = useRef();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const numbers_operations = [];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const btns_operations = [];

  const [numbersOperations, setNO] = useState([]); // These are the buttons with the numbers
  const [btnsOperations, setBO] = useState([]); // These are the buttons with the operations of adding, subtracting, etc.
  const [isLoad, setLoad] = useState(false); // Check if the page already loaded
  const [lastNumber, setLastN] = useState(0); // Last number is the last result you have

  // Numbers Allow

  const numbers_allow = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    ".",
    "√",
  ];

  // Symbols Allow

  const symbols_allow = ["+", "-", "/", "*"];

  // Last number
  let lastNumberKB;

  //Other Symbols

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const osymbols_btns = ["+", "-", "/", "*", "C", "π", "√", ".", "="];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const addItem = (v) => {
    if (inputOperations.current.value === "0") {
      inputOperations.current.value = v;
    } else {
      inputOperations.current.value += v;
    }

    inputOperations.current.focus();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const executeOperation = (type) => {
    const notprint = ["C", "=", "+", "-", "*", "/", "π"];

    if (notprint.indexOf(type) < 0) {
      inputOperations.current.value += type;

      if (inputOperations.current.value === "0") {
        inputOperations.current.value = type;
      } else {
        if (type !== ".") {
          inputOperations.current.value = type;
        }
      }
    } else {
      if (symbols_allow.indexOf(type) >= 0) {
        if (inputOperations.current.value !== "0") {
          if (!inputOperations.current.value.startsWith("√")) {
            if (lastNumberKB > 0) {
              operationsZone.current.textContent =
                inputOperations.current.value !== 0 &&
                symbols_allow.indexOf(type) > -1
                  ? solveOperation(
                      type,
                      lastNumberKB,
                      inputOperations.current.value
                    ) +
                    " " +
                    type
                  : "";

              lastNumberKB = solveOperation(
                type,
                lastNumberKB,
                inputOperations.current.value
              );
              inputOperations.current.value = "0";
            } else {
              operationsZone.current.textContent =
                inputOperations.current.value !== 0 &&
                symbols_allow.indexOf(type) > -1
                  ? inputOperations.current.value + " " + type
                  : "";

              lastNumberKB = inputOperations.current.value;
              inputOperations.current.value = "0";
            }
          } else {
            alert("An error occurred!");
          }
        }
      } else {
        if (type === "C") {
          inputOperations.current.value = "0";
          operationsZone.current.textContent = "";

          setLastN(0);
          lastNumberKB = 0;
        } else if (type === "π") {
          inputOperations.current.value = Math.PI;
        } else if (type === "=") {
          inputOperations.current.value = lastNumber || lastNumberKB;
        }
      }
    }
  };

  useEffect(() => {
    if (!isLoad) {
      inputOperations.current.value = 0;

      for (let i = 1; i < 10; i++) {
        numbers_operations.push(
          <div
            key={i}
            data-number={i}
            className="buttons-number"
            onClick={() => addItem(i)}
          >
            <span className="span-number">{i}</span>
          </div>
        );
      }

      for (let i = 0; i < osymbols_btns.length; i++) {
        btns_operations.push(
          <div
            key={i}
            data-symbol={osymbols_btns[i]}
            className="buttons-number"
            onClick={() => executeOperation(osymbols_btns[i])}
          >
            <span className="span-btn-symbol">{osymbols_btns[i]}</span>
          </div>
        );
      }

      setNO(numbers_operations);
      setBO(btns_operations);

      setLoad(true);
    }
  }, [
    setNO,
    isLoad,
    numbers_operations,
    btns_operations,
    osymbols_btns,
    executeOperation,
    addItem,
  ]);

  // Solve operations

  // const solveOperation = (type["+", "-", "*", ...], lastNumber, currentValue => inputOperations.current.value) > Structure

  const solveOperation = (type, lastN, currentValue) => {
    const __lastN = Number(lastN);
    const __cNumber = Number(currentValue);

    const result =
      type === "+"
        ? __lastN + __cNumber
        : type === "-"
        ? __lastN - __cNumber
        : type === "*"
        ? __lastN * __cNumber
        : type === "/"
        ? __lastN * __cNumber
        : "";

    return result;
  };

  const OnkeyInput = (e, key) => {
    if (numbers_allow.indexOf(key) >= 0) {
      if (inputOperations.current.value === "0") {
        inputOperations.current.value = "";
      }
    } else {
      e.preventDefault();
    }

    if (symbols_allow.indexOf(key) >= 0) {
      if (inputOperations.current.value !== "0") {
        if (lastNumber > 0) {
          operationsZone.current.textContent =
            inputOperations.current.value !== 0 &&
            symbols_allow.indexOf(key) > -1
              ? solveOperation(key, lastNumber, inputOperations.current.value) +
                " " +
                key
              : "";

          setLastN(
            solveOperation(key, lastNumber, inputOperations.current.value)
          );
        } else {
          operationsZone.current.textContent =
            inputOperations.current.value !== 0 &&
            symbols_allow.indexOf(key) > -1
              ? inputOperations.current.value + " " + key
              : "";

          setLastN(inputOperations.current.value);
        }

        inputOperations.current.value = "0";
      }
    }
  };

  return (
    <div className="background-model">
      <div className="base">
        <div className="base-separator">
          <div className="base-input-mark">
            <div className="base-input-separator">
              <span
                className="sum-operations-input"
                ref={operationsZone}
                data-operation=""
              ></span>
              <input
                className="input-text-operation"
                name="input-operation"
                ref={inputOperations}
                onKeyPress={(e) => OnkeyInput(e, e.key)}
                placeholder="Type operation here"
              />
            </div>
          </div>
        </div>
        <div className="flex-table">{numbersOperations}</div>
        <div className="flex-table-two">{btnsOperations}</div>
      </div>
    </div>
  );
}

export default Index;
