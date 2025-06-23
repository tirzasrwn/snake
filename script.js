let deferredPrompt;

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
  document.getElementById("installButton").style.display = "block";
});

document.getElementById("installButton").addEventListener("click", async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User's choice: ${outcome}`);
    deferredPrompt = null;
    document.getElementById("installButton").style.display = "none";
  }
});

window.addEventListener("appinstalled", () => {
  console.log("PWA installed successfully!");
});

// Responsive canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartButton = document.getElementById("restartButton");

// Set initial canvas size based on device
function setupCanvas() {
  const maxWidth = Math.min(window.innerWidth * 0.9, 854);
  const maxHeight = Math.min(window.innerHeight * 0.6, 480);

  // Maintain 16:9 aspect ratio
  const aspectRatio = 16 / 9;
  let canvasWidth = maxWidth;
  let canvasHeight = canvasWidth / aspectRatio;

  if (canvasHeight > maxHeight) {
    canvasHeight = maxHeight;
    canvasWidth = canvasHeight * aspectRatio;
  }

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // Adjust box size based on canvas dimensions
  box = Math.max(10, Math.floor(Math.min(canvasWidth, canvasHeight) / 30));
}

let box;
let rows, cols;
let snake;
let food;
let direction;
let score;
let bestScore = localStorage.getItem("bestScore") || 0;
let game;

// Theme management
let darkMode = false;
let snakeHeadColor, snakeBodyColor, snakeBorderColor, foodColor, gameOverTextColor;

function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    darkMode = savedTheme === 'dark';
  } else {
    darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  applyTheme();
}

function applyTheme() {
  if (darkMode) {
    document.body.classList.add('dark-theme');
    document.getElementById('themeToggle').textContent = '☀️ Light Mode';
    
    // Set dark theme colors
    snakeHeadColor = '#8bd5ca';
    snakeBodyColor = '#363a4f';
    snakeBorderColor = '#b7bdf8';
    foodColor = '#f5a97f';
    gameOverTextColor = '#ed8796';
  } else {
    document.body.classList.remove('dark-theme');
    document.getElementById('themeToggle').textContent = '🌙 Dark Mode';
    
    // Set light theme colors
    snakeHeadColor = '#7ED7C1';
    snakeBodyColor = 'white';
    snakeBorderColor = '#B06161';
    foodColor = '#B06161';
    gameOverTextColor = '#DC8686';
  }
}

function toggleTheme() {
  darkMode = !darkMode;
  localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  applyTheme();
}

function initializeGame() {
  setupCanvas();

  rows = Math.floor(canvas.height / box);
  cols = Math.floor(canvas.width / box);

  snake = [];
  for (let i = 0; i < 3; i++) {
    snake.push({ x: (10 - i) * box, y: 10 * box });
  }

  food = {
    x: Math.floor(Math.random() * cols) * box,
    y: Math.floor(Math.random() * rows) * box,
  };

  direction = "RIGHT";
  score = 0;

  if (game) clearInterval(game);
  game = setInterval(drawGame, 100);
}

function changeDirection(event) {
  if (event.keyCode == 37 && direction != "RIGHT") {
    direction = "LEFT";
  } else if (event.keyCode == 38 && direction != "DOWN") {
    direction = "UP";
  } else if (event.keyCode == 39 && direction != "LEFT") {
    direction = "RIGHT";
  } else if (event.keyCode == 40 && direction != "UP") {
    direction = "DOWN";
  }
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? snakeHeadColor : snakeBodyColor;
    ctx.fillRect(snake[i].x, snake[i].y, box, box);

    ctx.strokeStyle = snakeBorderColor;
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw the food
  ctx.fillStyle = foodColor;
  ctx.fillRect(food.x, food.y, box, box);

  // Get the current head position
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  // Update the head position based on the direction
  if (direction == "LEFT") snakeX -= box;
  if (direction == "UP") snakeY -= box;
  if (direction == "RIGHT") snakeX += box;
  if (direction == "DOWN") snakeY += box;

  // Check if the snake eats the food
  if (snakeX == food.x && snakeY == food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * cols) * box,
      y: Math.floor(Math.random() * rows) * box,
    };
  } else {
    snake.pop();
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  // Check for collision with the walls or itself
  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvas.width ||
    snakeY >= canvas.height ||
    collision(newHead, snake)
  ) {
    gameOver();
    return;
  }

  snake.unshift(newHead);

  // Display the score and best score
  document.getElementById("score").innerHTML = score;
  document.getElementById("bestScore").innerHTML = bestScore;
}

function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x == array[i].x && head.y == array[i].y) {
      return true;
    }
  }
  return false;
}

function gameOver() {
  clearInterval(game);
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("bestScore", bestScore);
  }

  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = gameOverTextColor;
  ctx.font = `bold ${Math.min(50, canvas.width / 10)}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 30);
  ctx.fillText(
    `Score: ${score} | Best: ${bestScore}`,
    canvas.width / 2,
    canvas.height / 2 + 30,
  );
}

// Mobile control handlers
document.getElementById("upButton").addEventListener("click", () => {
  if (direction != "DOWN") direction = "UP";
});

document.getElementById("leftButton").addEventListener("click", () => {
  if (direction != "RIGHT") direction = "LEFT";
});

document.getElementById("rightButton").addEventListener("click", () => {
  if (direction != "LEFT") direction = "RIGHT";
});

document.getElementById("downButton").addEventListener("click", () => {
  if (direction != "UP") direction = "DOWN";
});

// Initialize the game
document.addEventListener("keydown", changeDirection);
restartButton.addEventListener("click", initializeGame);
window.addEventListener("resize", initializeGame);

// Theme toggle
document.getElementById('themeToggle').addEventListener('click', toggleTheme);
loadTheme();
initializeGame();
