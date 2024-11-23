import React, { useState } from "react";
import "./App.css";

// Function to generate a list of hex colors
const generateHexColors = (numColors: number) => {
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    const color = `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;
    colors.push(color);
  }
  return colors;
};

// Function to calculate contrast ratio with white text
const getContrastRatio = (hexColor: string) => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
};

const colors = generateHexColors(1000);

function App() {
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(colors.length - 1);
  const [showInstructions, setShowInstructions] = useState(true);

  const handleChoice = (choice: "left" | "right") => {
    setShowInstructions(false);
    const mid = Math.floor((left + right) / 2);
    if (choice === "left") {
      setRight(mid);
    } else {
      setLeft(mid + 1);
    }
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (left === right) return;
    if (event.key === "ArrowLeft") {
      handleChoice("left");
    } else if (event.key === "ArrowRight") {
      handleChoice("right");
    }
  };

  const handleReset = () => {
    setLeft(0);
    setRight(colors.length - 1);
    setShowInstructions(true);
  };

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [left, right]);

  const progress = Math.round(
    ((colors.length - (right - left)) / colors.length) * 100
  );

  if (left === right) {
    return (
      <div
        className="favorite-color-screen"
        style={{
          backgroundColor: colors[left],
          color: getContrastRatio(colors[left]),
        }}
        role="alert"
      >
        <h2>Your favorite color is {colors[left]}!</h2>
        <button
          onClick={handleReset}
          style={{
            backgroundColor: getContrastRatio(colors[left]),
            color: colors[left],
          }}
        >
          Start Over
        </button>
      </div>
    );
  }

  const mid = Math.floor((left + right) / 2);

  return (
    <>
      <div className="app-header">
        <h1>Figure out your favorite color</h1>
        <div
          className="progress-bar"
          role="progressbar"
          aria-valuenow={progress}
        >
          Progress: {progress}%
        </div>
      </div>
      {showInstructions && (
        <div className="instructions">
          <p>Choose between two colors by clicking or using arrow keys.</p>
          <p>← Left arrow for left color</p>
          <p>→ Right arrow for right color</p>
        </div>
      )}
      <div className="app-container">
        <div className="color-container">
          <div
            className="color-option"
            style={{
              backgroundColor: colors[left],
              color: getContrastRatio(colors[left]),
            }}
            onClick={() => handleChoice("left")}
            role="button"
            tabIndex={0}
            aria-label={`Select left color: ${colors[left]}`}
          >
            {colors[left]}
          </div>
          <div
            className="color-option"
            style={{
              backgroundColor: colors[mid + 1],
              color: getContrastRatio(colors[mid + 1]),
            }}
            onClick={() => handleChoice("right")}
            role="button"
            tabIndex={0}
            aria-label={`Select right color: ${colors[mid + 1]}`}
          >
            {colors[mid + 1]}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
