// Variables and constant

let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('../music/food.mp3');
const gameOver = new Audio('../music/gameover.mp3');
const moveSound = new Audio('../music/8-bit-pop-sound-effect.mp3');
moveSound.volume = 0.4;
const music = new Audio('../music/8-Bit-Adventure.mp3');
music.loop = true;
let frameSpeed = 8;
let score = 0;
let lastPaintTime = 0;
let snake = [{ x: 9, y: 13 }]; // Snake starting position
let food = { x: 16, y: 20 };
// Snake Direction indicator
let snakeDirElement = document.createElement('div');

// Game functions

function main(ctime) {
    window.requestAnimationFrame(main);
    //console.log(ctime);
    if ((ctime - lastPaintTime) / 1000 < 1 / frameSpeed)
        return;
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snakeArr) {

    // If snakes bumps into itself
    for (let i = 1; i < snakeArr.length; i++)
        if (snakeArr[0].x === snakeArr[i].x && snakeArr[0].y === snakeArr[i].y)
            return true;
    // If snake bumps into the wall
    if (snakeArr[0].x > 32 || snakeArr[0].x < 1 || snakeArr[0].y > 32 || snakeArr[0].y < 1)
        return true;
    return false;
}

function gameEngine() {

    // Update snake position

    // If snake collides with itself or wall
    if (isCollide(snake)) {
        gameOver.play();
        music.load();
        inputDir = { x: 0, y: 0 };
        alert("Game Over!");
        snake = [{ x: 9, y: 13 }];
        score = 0;
        scorediv.innerHTML = "Score: " + score;
    }

    // If food eaten increase score and regenerate food
    if (snake[0].x === food.x && snake[0].y === food.y) {
        foodSound.play();
        score += 1;
        scorediv.innerHTML = "Score: " + score;

        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            highscorediv.innerHTML = "HighScore: " + hiscoreval;
        }

        snake.unshift({ x: snake[0].x + inputDir.x, y: snake[0].y + inputDir.y });
        flag = 0;
        while (flag == 0) {
            let a = 2, b = 31;
            food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
            flagfood = 0;
            for (let i = 0; i < snake.length; i++)
                if (snake[i].x === food.x && snake[i].y === food.y) {
                    flagfood = 1;
                    break;
                }
            if (flagfood == 0)
                flag = 1;
        }
    }

    // Moving the snake
    for (let i = snake.length - 2; i >= 0; i--)
        snake[i + 1] = { ...snake[i] }; // Destructuring the array
    snake[0].x += inputDir.x;
    snake[0].y += inputDir.y;

    // Empty the board
    board.innerHTML = "";

    // Display food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);

    // Display snake
    snake.forEach((e, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0)
            snakeElement.classList.add('head');
        else
            snakeElement.classList.add('snake');
        board.appendChild(snakeElement);

        if (snakeElement.classList.contains('head'))
            snakeElement.appendChild(snakeDirElement);
    });
}

// Main function run & work
let hiscore = localStorage.getItem("hiscore"); // High Socre value
if (hiscore === null) {
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
} else {
    hiscoreval = JSON.parse(hiscore);
    highscorediv.innerHTML = "HighScore: " + hiscore;
}

window.requestAnimationFrame(main);
window.addEventListener('keydown', (e) => {
    //inputDir = { x: 0, y: 1 };  Game Start
    moveSound.play();
    music.play();
    snakeDirElement.className = "";
    switch (e.key) {
        case "W":
        case "w":
        case "ArrowUp":
            // Up pressed
            inputDir.x = 0;
            inputDir.y = -1;
            snakeDirElement.classList.add('dir-up');
            break;

        case "S":
        case "s":
        case "ArrowDown":
            // Down pressed     
            inputDir.x = 0;
            inputDir.y = 1;
            snakeDirElement.classList.add('dir-down');
            break;

        case "A":
        case "a":
        case "ArrowLeft":
            // Left pressed
            inputDir.x = -1;
            inputDir.y = 0;
            snakeDirElement.classList.add('dir-left');
            break;

        case "D":
        case "d":
        case "ArrowRight":
            // Right pressed
            inputDir.x = 1;
            inputDir.y = 0;
            snakeDirElement.classList.add('dir-right');
            break;

        case "Escape":
        case "P":
        case "p":
            // p pressed GAME PAUSE
            music.pause();
            alert("Game Paused!, Press OK to continue");
            music.play();
            break;
    }
});