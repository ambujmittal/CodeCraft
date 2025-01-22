import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit/react";

export interface CompilerSliceStateType {
  fullCode: {
    html: string;
    css: string;
    javascript: string;
  };
  currentLanguage: "html" | "css" | "javascript";
  isOwner: boolean;
}

const initialState: CompilerSliceStateType = {
  fullCode: {
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Whack-a-Mole Game</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="game-container">
    <h1>Whack-a-Mole!</h1>
    <p>Score: <span id="score">0</span></p>
    <div class="grid">
      <div class="hole" data-index="0"></div>
      <div class="hole" data-index="1"></div>
      <div class="hole" data-index="2"></div>
      <div class="hole" data-index="3"></div>
      <div class="hole" data-index="4"></div>
      <div class="hole" data-index="5"></div>
    </div>
    <button id="start-btn">Start Game</button>
  </div>
  <script src="script.js"></script>
</body>
</html>
    `,
    css: `
body {
  font-family: Arial, sans-serif;
  background-color: #f3f3f3;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

#game-container {
  text-align: center;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  gap: 20px;
  margin: 20px auto;
  width: fit-content;
}

.hole {
  width: 100px;
  height: 100px;
  background-color: #ddd;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
}

.hole .mole {
  width: 80px;
  height: 80px;
  background-color: brown;
  border-radius: 50%;
  position: absolute;
  bottom: -80px;
  left: 10px;
  transition: all 0.3s ease;
}

.hole.active .mole {
  bottom: 10px;
}

button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #218838;
}
    `,
    javascript: `
const holes = document.querySelectorAll('.hole');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('start-btn');

let score = 0;
let lastHole;
let timeUp = false;

function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
  const index = Math.floor(Math.random() * holes.length);
  const hole = holes[index];
  if (hole === lastHole) {
    return randomHole(holes);
  }
  lastHole = hole;
  return hole;
}

function showMole() {
  const time = randomTime(300, 1000);
  const hole = randomHole(holes);
  hole.classList.add('active');
  setTimeout(() => {
    hole.classList.remove('active');
    if (!timeUp) showMole();
  }, time);
}

function startGame() {
  score = 0;
  scoreDisplay.textContent = score;
  timeUp = false;
  showMole();
  setTimeout(() => (timeUp = true), 15000); // Game duration: 15 seconds
}

function hitMole(event) {
  if (!event.target.classList.contains('mole')) return;
  score++;
  event.target.parentElement.classList.remove('active');
  scoreDisplay.textContent = score;
}

holes.forEach((hole) => {
  const mole = document.createElement('div');
  mole.classList.add('mole');
  hole.appendChild(mole);
  hole.addEventListener('click', hitMole);
});

startButton.addEventListener('click', startGame);
    `,
  },
  currentLanguage: "javascript",
  isOwner: false,
};

const compilerSlice = createSlice({
  name: "compilerSlice",
  initialState,
  reducers: {
    updateCurrentLanguage: (
      state,
      action: PayloadAction<CompilerSliceStateType["currentLanguage"]>
    ) => {
      state.currentLanguage = action.payload;
    },
    updateCodeValue: (state, action: PayloadAction<string>) => {
      state.fullCode[state.currentLanguage] = action.payload;
    },
    updateIsOwner: (state, action: PayloadAction<boolean>) => {
      state.isOwner = action.payload;
    },
    updateFullCode: (
      state,
      action: PayloadAction<CompilerSliceStateType["fullCode"]>
    ) => {
      state.fullCode = action.payload;
    },
  },
});

export default compilerSlice.reducer;
export const {
  updateCurrentLanguage,
  updateCodeValue,
  updateFullCode,
  updateIsOwner,
} = compilerSlice.actions;
