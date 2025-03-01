//board
let board;
let boardWidth = 475; /* width of the original picture*/
let boardHeight = 750;
let context;

//bird size
let birdWidth = 60;
let birdHeight = 60;
let birdX_pos = boardWidth / 8;
let birdY_pos = boardHeight / 2;
let birdImg;
let bird = {
    x: birdX_pos,
    y: birdY_pos,
    width: birdWidth,
    height: birdHeight
}

//size of the pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//game
let velocity_x = -2;    //move in left
let velocity_y = 0; //bird jump speed
let gravity = 0.4; //gravity effect
let jumpStrength = -8; //strength of the bird's jump
let gameOver = false;
let score = 0;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");   /* used to draw in the board */

    //loading the image of bird
    birdImg = new Image();
    birdImg.src = "./flappybird.png"
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png"

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png"

    requestAnimationFrame(update);
    setInterval(placePipes, 1500); // this will set every pipe at 1.5 seconds
    document.addEventListener("keydown", moveBird);
}

function update() {
    if (gameOver) {
        return; // Stop the game if it's over
    }
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    // Apply gravity to the bird
    velocity_y += gravity;
    bird.y += velocity_y;

    // Ensure the bird stays within the canvas bounds
    if (bird.y > boardHeight - bird.height) {
        bird.y = boardHeight - bird.height; // Prevent bird from falling off the bottom
        gameOver = true; // Game over if bird hits the ground
    }
    if (bird.y < 0) {
        bird.y = 0; // Prevent bird from going above the canvas
        velocity_y = 0; // Stop vertical movement
    }

    // Draw the bird for each frame
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    // Draw and move pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocity_x;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        // Collision detection
        if (detectCollision(bird, pipe)) {
            gameOver = true; // Game over if bird hits a pipe
        }

        // Score increment logic
        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            pipe.passed = true;
            score += 0.5; // Increment score by 0.5 for each pipe (1 point for a pair)
        }

        // Remove pipes that are off the screen
        if (pipe.x + pipe.width < 0) {
            pipeArray.splice(i, 1);
            i--;
        }
    }

    // Display score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, boardWidth / 2, 100);

    // Display game over message
    if (gameOver) {
        context.fillStyle = "red";
        context.font = "50px sans-serif";
        context.fillText("GAME OVER", boardWidth / 4, boardHeight / 2);
    }
}

function placePipes() {
    if (gameOver) {
        return; // Stop placing pipes if the game is over
    }
    let randomPipeY = pipeY - (pipeHeight / 4) - (Math.random() * (pipeHeight / 2));
    let openingSpace = boardHeight / 4;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }

    pipeArray.push(topPipe);
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        // Make the bird jump
        velocity_y = jumpStrength;

        // Reset game if it's over
        if (gameOver) {
            bird.y = birdY_pos;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(bird, pipe) {
    return (
        bird.x < pipe.x + pipe.width && // Bird's right edge > pipe's left edge
        bird.x + bird.width > pipe.x && // Bird's left edge < pipe's right edge
        bird.y < pipe.y + pipe.height && // Bird's bottom edge > pipe's top edge
        bird.y + bird.height > pipe.y    // Bird's top edge < pipe's bottom edge
    );
}