import CodeEditor from "@/components/CodeEditor";
import HelperHeader from "@/components/HelperHeader";
import Loader from "@/components/Loader/Loader";
import RenderCode from "@/components/RenderCode";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useLoadCodeMutation } from "@/redux/slices/api";
import { updateFullCode, updateIsOwner } from "@/redux/slices/compilerSlice";
import { RootState } from "@/redux/store";
import { handleError } from "@/utils/handleError";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export default function Compiler() {
  const { urlId } = useParams();
  const windowWidth = useSelector(
    (state: RootState) => state.appSlice.windowWidth
  );
  const [loadExistingCode, { isLoading }] = useLoadCodeMutation();
  const dispatch = useDispatch();

  const initialState = {
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
  };
  const loadCode = async () => {
    try {
      if (urlId) {
        const response = await loadExistingCode({ urlId }).unwrap();
        dispatch(updateFullCode(response.fullCode));
        dispatch(updateIsOwner(response.isOwner));
      } else {
        dispatch(updateFullCode(initialState));
        dispatch(updateIsOwner(false));
      }
    } catch (error) {
      handleError(error);
    }
  };
  useEffect(() => {
    loadCode();
  }, [urlId]);

  if (isLoading)
    return (
      <div className="w-full h-[calc(100dvh-60px)] flex justify-center items-center">
        <Loader />
      </div>
    );
  return (
    <ResizablePanelGroup
      direction={windowWidth > 640 ? "horizontal" : "vertical"}
      className="w-full !h-[calc(100vh-60px)]"
    >
      <ResizablePanel defaultSize={50} className="!h-[calc(100vh-60px)]">
        <HelperHeader />
        <CodeEditor />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel
        className="h-[calc(100dvh-60px)] min-w-[350px]"
        defaultSize={50}
      >
        <RenderCode />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
