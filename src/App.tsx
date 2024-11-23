import React, { useState } from "react";
import "./App.css";

// Function to generate a list of hex colors
const generateHSLColors = () => {
  const colors = [];
  // Generate colors with evenly distributed hue, saturation, and lightness
  for (let h = 0; h < 360; h += 5) {
    // hue: 0-360
    for (let s = 20; s <= 100; s += 20) {
      // saturation: 20-100
      for (let l = 20; l <= 80; l += 20) {
        // lightness: 20-80
        colors.push(`hsl(${h}, ${s}%, ${l}%)`);
      }
    }
  }
  return colors;
};

const hslToHex = (hslColor: string) => {
  // Extract h,s,l from the hsl string
  const [h, s, l] = hslColor
    .match(/\d+/g)!
    .map((n, i) => (i === 0 ? Number(n) : Number(n) / 100));

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (60 <= h && h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (120 <= h && h < 180) {
    [r, g, b] = [0, c, x];
  } else if (180 <= h && h < 240) {
    [r, g, b] = [0, x, c];
  } else if (240 <= h && h < 300) {
    [r, g, b] = [x, 0, c];
  } else if (300 <= h && h < 360) {
    [r, g, b] = [c, 0, x];
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Function to calculate contrast ratio with white text
const getContrastRatio = (hslColor: string) => {
  // Extract lightness value from HSL string
  const l = parseInt(hslColor.split(",")[2].replace("%)", ""));
  return l > 50 ? "#000000" : "#ffffff";
};

const colors = generateHSLColors();

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
    if (event.key === "ArrowUp") {
      handleReset();
      return;
    }
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
  }, [left, right, handleChoice, handleReset]);

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
        <h2>Your favorite color is:</h2>
        <p style={{ fontSize: "2rem", margin: "1rem 0" }}>{colors[left]}</p>
        <p style={{ fontSize: "2.5rem", fontWeight: "bold", margin: "1rem 0" }}>
          {hslToHex(colors[left])}
        </p>
        <button
          onClick={handleReset}
          style={{
            backgroundColor: getContrastRatio(colors[left]),
            color: colors[left],
            fontSize: "1.2rem",
            padding: "0.8rem 1.5rem",
            marginTop: "2rem",
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
        <h1>
          Even if they don't know what it is, everyone has a favorite colour.
          Figure out yours here
        </h1>
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
          <p>↑ Up arrow to reset</p>
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
              backgroundColor: colors[mid], // Changed from mid + 1 to mid
              color: getContrastRatio(colors[mid]),
            }}
            onClick={() => handleChoice("right")}
            role="button"
            tabIndex={0}
            aria-label={`Select right color: ${colors[mid]}`}
          >
            {colors[mid]} {/* Changed from mid + 1 to mid */}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
