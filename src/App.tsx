import React, { useState } from "react";
import "./App.css";

const generateHSLColors = () => {
  // Popular color ranges based on color psychology and preference studies
  const popularHues = [
    { start: 200, end: 240, weight: 2 }, // Blues (most common favorite)
    { start: 0, end: 15, weight: 1.5 }, // Reds
    { start: 270, end: 290, weight: 1.5 }, // Purples
    { start: 120, end: 150, weight: 1 }, // Greens
  ];

  const baseColors = [];
  // Generate colors with perceptually uniform steps
  for (let h = 0; h < 360; h += 5) {
    // Reduced step size for more precision
    const hueWeight =
      popularHues.find((range) => h >= range.start && h <= range.end)?.weight ||
      1;

    for (let s = 75; s <= 95; s += 10) {
      // Adjusted saturation range
      for (let l = 45; l <= 65; l += 10) {
        // Adjusted lightness range
        // Repeat popular colors based on weight
        const repeats = Math.round(hueWeight);
        for (let i = 0; i < repeats; i++) {
          baseColors.push(`hsl(${h}, ${s}%, ${l}%)`);
        }
      }
    }
  }

  return baseColors.sort((a, b) => {
    const [h1, s1, l1] = a.match(/\d+/g)!.map((n) => parseInt(n));
    const [h2, s2, l2] = b.match(/\d+/g)!.map((n) => parseInt(n));

    const weight1 =
      popularHues.find((range) => h1 >= range.start && h1 <= range.end)
        ?.weight || 1;
    const weight2 =
      popularHues.find((range) => h2 >= range.start && h2 <= range.end)
        ?.weight || 1;

    if (weight1 !== weight2) return weight2 - weight1;

    // Perceptual attributes
    if (Math.abs(h1 - h2) > 30) return h1 - h2;
    if (s1 !== s2) return s2 - s1; // Prefer more saturated
    return l2 - l1; // Prefer brighter
  });
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
