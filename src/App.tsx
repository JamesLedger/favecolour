// src/App.tsx
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

const colors = generateHexColors(128); // Generate 128 random hex colors

function App() {
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(colors.length - 1);

  const handleChoice = (choice: "left" | "right") => {
    const mid = Math.floor((left + right) / 2);
    if (choice === "left") {
      setRight(mid);
    } else {
      setLeft(mid + 1);
    }
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    // Disable key input when favorite color is determined
    if (left === right) return;

    if (event.key === "ArrowLeft") {
      handleChoice("left");
    } else if (event.key === "ArrowRight") {
      handleChoice("right");
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [left, right]);

  if (left === right) {
    return (
      <div
        className="favorite-color-screen"
        style={{ backgroundColor: colors[left] }}
      >
        Your favorite color is {colors[left]}!
      </div>
    );
  }

  const mid = Math.floor((left + right) / 2);

  return (
    <>
      <div className="app-header">
        <h1>Figure out your favorite color</h1>
      </div>
      <div className="app-container">
        <div className="color-container">
          <div
            className="color-option"
            style={{ backgroundColor: colors[left] }}
            onClick={() => handleChoice("left")}
          >
            {colors[left]}
          </div>
          <div
            className="color-option"
            style={{ backgroundColor: colors[mid + 1] }}
            onClick={() => handleChoice("right")}
          >
            {colors[mid + 1]}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
