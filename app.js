// Constants
const ROW = 12;
const COL = 3;
const SIZE = 40;
const VACANT = "white";

// canvas variables
const canvas = document.getElementById("game-area");
const ctx = canvas.getContext("2d");

ctx.canvas.width = COL * SIZE;
ctx.canvas.height = ROW * SIZE;

// level control Buttons
const levelDownBtn = document.querySelector(".level-down");
const levelUpBtn = document.querySelector(".level-up");

let gameScore = 0;
let score = document.querySelector(".score");
const helpBtn = document.querySelector(".help");

// Ball control Buttonsu
const leftBtn = document.querySelector(".left");
const rightBtn = document.querySelector(".right");
const downBtn = document.querySelector(".down");

const colors = ["purple", "green", "yellow", "skyblue"];

//Score Update Function
function updateScore() {
    let score = document.querySelector(".score");
    let scoreVal = Number(score.innerHTML);
    score.innerHTML = scoreVal + 10;
    gameScore = scoreVal + 10;
}

let gamelevel = 1;
// Level Down Function
function levelDown() {
    let level = document.querySelector(".level");
    let levelVal = Number(level.innerHTML)
    if (levelVal === 1) {
        alert("Level should be at least 1");
    } else {
        level.innerHTML = levelVal - 1;
        gamelevel = levelVal - 1;
    }
    drop();
};

// Level up Function
function levelUp() {
    let level = document.querySelector(".level");
    let levelVal = Number(level.innerHTML);
    if (levelVal === 5) {
        alert("Level 5 is max");
    } else {
        level.innerHTML = levelVal + 1;
        gamelevel = levelVal + 1;
    }
    drop()
}

// function to draw Ball
function drawBall(x, y, color) {
    ctx.fillStyle = color;
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.arc((SIZE / 2) + SIZE * x, (SIZE / 2) + SIZE * y, (SIZE / 2), 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    // ctx.fillRect(SIZE*x,SIZE*y,SIZE,SIZE);
}

// to create the board
let r = 0, c = 0;
let board = [];
for (r = 0; r < ROW; r++) {
    board[r] = [];
    for (c = 0; c < COL; c++) {
        board[r][c] = VACANT;
    }
}

// to draw the board
function drawBoard() {
    for (r = 0; r < ROW; r++) {
        for (c = 0; c < COL; c++) {
            drawBall(c, r, board[r][c]);
        }
    }
}

function Ball(x, y, color) {
    this.color = color;
    this.x = x;
    this.y = y;
}
Ball.prototype.draw = function () {
    drawBall(this.x, this.y, this.color);
    // board[this.y][this.x] = this.color;
}
Ball.prototype.unDraw = function () {
    drawBall(this.x, this.y, VACANT);
    // board[this.y][this.x] = VACANT;
}
Ball.prototype.collision = function (x, y) {
    let newX = this.x + x;
    let newY = this.y + y;
    // console.log(newX, newY)
    if (newX < 0 || newX >= COL || newY >= ROW) {
        return true;
    }

    if (newY < 0) {
    } else if (board[newY][newX] != VACANT) {
        return true;
    }

    return false;
}
Ball.prototype.lock = function () {
    if (this.y < 0) {
        alert(`Game Over!\n Your Score is ${gameScore}`);
        gameOver = true;
        location.reload();
    } else {
        board[this.y][this.x] = this.color;
        // check score
        if (this.y < 10) {
            if((board[this.y][this.x] == board[this.y + 1][this.x] && board[this.y + 1][this.x] == board[this.y + 2][this.x]) && (board[this.y][0] == board[this.y][1] && board[this.y][1] == board[this.y][2])){
                board[this.y][this.x] = board[this.y + 1][this.x] = board[this.y + 2][this.x] = VACANT;
                drawBall(this.x, this.y, VACANT);
                drawBall(this.x, this.y + 1, VACANT);
                drawBall(this.x, this.y + 2, VACANT);
                for (i = this.y; i > 0; i--) {
                    for (r = 0; r < ROW; r++) {
                        board[i][r] = board[i - 1][r];
                        drawBall(r, i, board[i][r]);
                    }
                }
                updateScore();
            }
            if (board[this.y][this.x] == board[this.y + 1][this.x] && board[this.y + 1][this.x] == board[this.y + 2][this.x]) {
                board[this.y][this.x] = board[this.y + 1][this.x] = board[this.y + 2][this.x] = VACANT;
                drawBall(this.x, this.y, VACANT);
                drawBall(this.x, this.y + 1, VACANT);
                drawBall(this.x, this.y + 2, VACANT);
                updateScore();
            }
        }
        if (board[this.y][this.x] != VACANT) {
            if (board[this.y][0] == board[this.y][1] && board[this.y][1] == board[this.y][2]) {
                for (i = this.y; i > 0; i--) {
                    for (r = 0; r < ROW; r++) {
                        board[i][r] = board[i - 1][r];
                        drawBall(r, i, board[i][r]);
                    }
                }
                console.log('bug')
                updateScore();
            }
        }
    }
}
Ball.prototype.moveDown = function () {

    if (!this.collision(0, 1)) {
        this.unDraw();
        this.y++;
        this.draw();
    } else {
        // lock this part and generate a new one
        this.lock();
        ball = randomBall();
    }
}
Ball.prototype.moveLeft = function () {
    if (!this.collision(-1, 0)) {
        this.unDraw();
        this.x--;
        this.draw();
    }
}
Ball.prototype.moveRight = function () {
    if (!this.collision(1, 0)) {
        this.unDraw();
        this.x++;
        this.draw();
    }
}
let dropStart = Date.now();
let gameOver = false;
function drop() {
    let now = Date.now();
    let delta = now - dropStart;
    if (delta > 1000 + 180 - gamelevel * 180) {
        ball.moveDown();
        dropStart = Date.now();
    }
    if (!gameOver) {
        requestAnimationFrame(drop);

    }
}


// Random Ball Function
function randomBall() {
    let randomN = Math.floor(Math.random() * colors.length)
    return new Ball(Math.floor(Math.random() * 3), -1, colors[randomN])
}
let ball = randomBall();
ball.draw()
drop();

function control() {
    if (event.keyCode == 37) {
        ball.moveLeft();
        dropStart = Date.now();
        leftBtn.focus();
    } else if (event.keyCode == 39) {
        ball.moveRight();
        dropStart = Date.now();
        rightBtn.focus();
    } else if (event.keyCode == 40) {
        ball.moveDown();
        dropStart = Date.now();
        downBtn.focus();
    } else if (event.keyCode == 107) {
        levelUp();
        levelUpBtn.focus();
    } else if (event.keyCode == 109) {
        levelDown();
        levelDownBtn.focus();
    }
}


//Event Listners
levelDownBtn.addEventListener("click", levelDown);
levelUpBtn.addEventListener("click", levelUp);
helpBtn.addEventListener("click", help);

leftBtn.addEventListener("click", function () {
    ball.moveLeft();
    dropStart = Date.now();
});
rightBtn.addEventListener("click", function () {
    ball.moveRight();
    dropStart = Date.now();
});
downBtn.addEventListener("click", function () {
    ball.moveDown();
    dropStart = Date.now();
});

document.addEventListener("keydown", control);

// Tab Trapping
var focusableElements = document.querySelectorAll(
    'a[href], area[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable], audio[controls], video[controls], summary, [tabindex^="0"], [tabindex^="1"], [tabindex^="2"], [tabindex^="3"], [tabindex^="4"], [tabindex^="5"], [tabindex^="6"], [tabindex^="7"], [tabindex^="8"], [tabindex^="9"]'
);
focusableElements = Array.prototype.slice.call(focusableElements);

var firstElement = focusableElements[0];
var lastElement = focusableElements[focusableElements.length - 1];

document.addEventListener("keydown", trap);
function trap(event) {
    if (event.keyCode === 9) {
        // Shift is held down
        if (event.shiftKey) {
            if (document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    }
}

function help(){
    alert(`Help\n
    - : to level Down\n
    + : to level Up\n
    > : to move right\n
    V : to move Down\n
    < : to move left\n`);
}
