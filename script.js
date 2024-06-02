/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("gameCanvas");

/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

/** @type {HTMLButtonElement} */
const restartButton = document.getElementById("restartButton");

/** @type {number} */
const box = 20;

/** @type {number} */
const rows = canvas.height / box;

/** @type {number} */
const cols = canvas.width / box;

/**
 * @typedef {Object} SnakePart
 * @property {number} x - The x-coordinate of the snake part.
 * @property {number} y - The y-coordinate of the snake part.
 */

/** @type {SnakePart[]} */
let snake;

/** @type {SnakePart} */
let food;

/** @type {string} */
let direction;

/** @type {number} */
let score;

/** @type {number} */
let game;

/**
 * Initializes the game by setting up the snake, food, score, and starting the game loop.
 */
function initializeGame() {
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

/**
 * Changes the direction of the snake based on keyboard input.
 * @param {KeyboardEvent} event - The keyboard event triggered by pressing a key.
 */
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

/**
 * Draws the game elements (snake, food, score) on the canvas and updates the game state.
 */
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "green" : "white";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);

    ctx.strokeStyle = "red";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw the food
  ctx.fillStyle = "red";
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

  // Display the score
  ctx.fillStyle = "white";
  ctx.font = "45px Changa one";
  ctx.fillText(score, 2 * box, 1.6 * box);
}

/**
 * Checks for collision between the snake's head and its body.
 * @param {SnakePart} head - The head of the snake.
 * @param {SnakePart[]} array - The body of the snake.
 * @returns {boolean} - True if there is a collision, otherwise false.
 */
function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x == array[i].x && head.y == array[i].y) {
      return true;
    }
  }
  return false;
}

/**
 * Displays the game over message and stops the game loop.
 */
function gameOver() {
  clearInterval(game);
  ctx.fillStyle = "red";
  ctx.font = "50px Arial";
  ctx.fillText("Game Over", canvas.width / 4, canvas.height / 2);
}

document.addEventListener("keydown", changeDirection);
restartButton.addEventListener("click", initializeGame);

initializeGame();
