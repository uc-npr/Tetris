/*
*   File Name    : App.js
*   Description  : Tetris game JS file
*   Author       : Nishant Pundir
*   Version      : 2
*   Created      : 18 Feb 2022
*   Updated By   : Nishant Pundir <nishant.pundir@ucertify.com>
*   Updated Date : 24 Mar 2022
*/

// Constants and Variables
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
let game_level = 1;
let max_level = 5;
let min_level = 1;
const level_down_button = document.querySelector(".level-down");
const level_up_button = document.querySelector(".level-up");
// game score
let game_score = 0;
let game_over = false;
const help_button = document.querySelector(".help");
// Ball control Buttons
const left_button = document.querySelector(".left");
const right_button = document.querySelector(".right");
const down_button = document.querySelector(".down");
// Ball colors
const colors = ["purple", "green", "yellow", "skyblue"];

// to create the board
let r = 0, c = 0;
let board = [];
function emptyBoard() {
    for (r = 0; r < ROW; r++) {
        board[r] = [];
        for (c = 0; c < COL; c++) {
            board[r][c] = VACANT;
        }
    }
}

// to draw the board
emptyBoard();
function drawBoard() {
    for (r = 0; r < ROW; r++) {
        for (c = 0; c < COL; c++) {
            drawBall(c, r, board[r][c]);
        }
    }
}

// function to draw Ball
function drawBall(x, y, color) {
    ctx.fillStyle = color;
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.arc((SIZE / 2) + SIZE * x, (SIZE / 2) + SIZE * y, (SIZE / 2), 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}

// Ball Constructor
function Ball(x, y, color) {
    this.color = color;
    this.x = x;
    this.y = y;

}
Ball.prototype.draw = function () {
    drawBall(this.x, this.y, this.color);
}
Ball.prototype.unDraw = function () {
    drawBall(this.x, this.y, VACANT);
}
Ball.prototype.collision = function (x, y) {
    let newX = this.x + x;
    let newY = this.y + y;
    if (newX < 0 || newX >= COL || newY >= ROW) {
        return true;
    }
    if (!(newY < 0) && board[newY][newX] != VACANT) {
        return true;
    }
    return false;
}
Ball.prototype.lock = function () {
    if (this.y < 0) {
        alert(`Game Over!\n Your Score is ${game_score}`);
        emptyBoard();
        drawBoard();
        game_score = 0;
        document.querySelector(".score").innerHTML = game_score;
    } else {
        board[this.y][this.x] = this.color;
        // check score
        if (this.y < 10) {
            if ((board[this.y][this.x] == board[this.y + 1][this.x] && board[this.y + 1][this.x] == board[this.y + 2][this.x]) && (board[this.y][0] == board[this.y][1] && board[this.y][1] == board[this.y][2])) {
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

//Score Update Function
function updateScore() {
    let score = document.querySelector(".score");
    let score_value = Number(score.innerHTML);
    score.innerHTML = score_value + 10;
    game_score = score_value + 10;
}

// Level Down Function
function levelDown() {
    let level = document.querySelector(".level");
    let level_value = Number(level.innerHTML)
    if (level_value === min_level) {
        alert(`Level should be at least ${min_level}`);
    } else {
        level.innerHTML = level_value - 1;
        game_level = level_value - 1;
    }
    drop();
};

// Level up Function
function levelUp() {
    let level = document.querySelector(".level");
    let level_value = Number(level.innerHTML);
    if (level_value === max_level) {
        alert(`Level ${max_level} is max`);
    } else {
        level.innerHTML = level_value + 1;
        game_level = level_value + 1;
    }
    drop();
}

// help Function
function help() {
    alert(`Help\n
    - : to level Down\n
    + : to level Up\n
    > : to move right\n
    V : to move Down\n
    < : to move left\n`);
}

// Random Ball Function
function randomBall() {
    let random_number = Math.floor(Math.random() * colors.length)
    return new Ball(1, -1, colors[random_number])
}

// event function
function init() {
    //Event Listners
    level_down_button.addEventListener("click", levelDown);
    level_up_button.addEventListener("click", levelUp);
    help_button.addEventListener("click", help);
    left_button.addEventListener("click", function () {
        ball.moveLeft();
        drop_start = Date.now();
    });
    right_button.addEventListener("click", function () {
        ball.moveRight();
        drop_start = Date.now();
    });
    down_button.addEventListener("click", function () {
        ball.moveDown();
        drop_start = Date.now();
    });
    // Ball control function
    document.addEventListener("keydown", control);
    function control(event) {
        if (event.keyCode == 37) {
            ball.moveLeft();
            drop_start = Date.now();
            left_button.focus();
        } else if (event.keyCode == 39) {
            ball.moveRight();
            drop_start = Date.now();
            right_button.focus();
        } else if (event.keyCode == 40) {
            ball.moveDown();
            drop_start = Date.now();
            down_button.focus();
        } else if (event.keyCode == 107) {
            levelUp();
            level_up_button.focus();
        } else if (event.keyCode == 109) {
            levelDown();
            level_down_button.focus();
        }
    }
}

let drop_start = Date.now();
function drop() {
    let now = Date.now();
    let delta = now - drop_start;
    if (delta > 1000 + 180 - game_level * 180) {
        ball.moveDown();
        drop_start = Date.now();
    }
    if (!game_over) {
        requestAnimationFrame(drop);
    }
}

let ball = randomBall();
ball.draw()
drop();
init();

// Tab Trapping
let focusableElements = document.querySelectorAll(
    'a[href], area[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable], audio[controls], video[controls], summary, [tabindex^="0"], [tabindex^="1"], [tabindex^="2"], [tabindex^="3"], [tabindex^="4"], [tabindex^="5"], [tabindex^="6"], [tabindex^="7"], [tabindex^="8"], [tabindex^="9"]'
);
focusableElements = Array.prototype.slice.call(focusableElements);

let firstElement = focusableElements[0];
let lastElement = focusableElements[focusableElements.length - 1];

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