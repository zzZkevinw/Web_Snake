const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const BLOCK_SIZE = 20; // 这里保持 BLOCK_SIZE 为常量
let SNAKE_SPEED = 250;
let snakeX = canvas.width / 2 - BLOCK_SIZE / 2;
let snakeY = canvas.height / 2 - BLOCK_SIZE / 2;
let snakeXChange = BLOCK_SIZE;
let snakeYChange = 0;
let snakeBody = [];
let foodX;
let foodY;
let score = 0;
let gameLoop;
let changeDirection = false; // 用于跟踪方向是否已经改变

function setBoardSize(size) {
    canvas.width = size;
    canvas.height = size;
    
    // 设置蛇的起始位置为网格的中心
    snakeX = Math.floor(canvas.width / 2 / BLOCK_SIZE) * BLOCK_SIZE - 20;
    snakeY = Math.floor(canvas.height / 2 / BLOCK_SIZE) * BLOCK_SIZE - 20;
    
    snakeXChange = BLOCK_SIZE;
    snakeYChange = 0;
    snakeBody = []; // 清空蛇的身体
    //draw(); // 重新绘制蛇和食物
    drawGrid(); // 重新绘制网格线
}



function generateFood() {
    foodX = Math.floor(Math.random() * (canvas.width / BLOCK_SIZE)) * BLOCK_SIZE;
    foodY = Math.floor(Math.random() * (canvas.height / BLOCK_SIZE)) * BLOCK_SIZE;
    snakeBody.forEach(block => {
        if (foodX === block.x && foodY === block.y) {
            generateFood();
        }
    });
}

function draw() {
    ctx.fillStyle = "#0D0008"; // 设置深紫色背景
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    snakeBody.forEach(block => {
        ctx.fillRect(block.x, block.y, BLOCK_SIZE, BLOCK_SIZE);
    });
    ctx.fillStyle = "red";
    ctx.fillRect(foodX, foodY, BLOCK_SIZE, BLOCK_SIZE);
    ctx.fillStyle = "black";
    ctx.font = "15px Arial";
}


function drawGrid() {
    // ctx.strokeStyle = "#ccc";
    // for (let x = 0; x < canvas.width; x += BLOCK_SIZE) {
    //     ctx.beginPath();
    //     ctx.moveTo(x, 0);
    //     ctx.lineTo(x, canvas.height);
    //     ctx.stroke();
    // }
    // for (let y = 0; y < canvas.height; y += BLOCK_SIZE) {
    //     ctx.beginPath();
    //     ctx.moveTo(0, y);
    //     ctx.lineTo(canvas.width, y);
    //     ctx.stroke();
    // }

    // 绘制黑色外边框
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1; // 设置线宽，你可以根据需要调整
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function updateScore() {
    document.getElementById("scoreBoard").innerText = "Score: " + score;
}

function update() {
    snakeX += snakeXChange;
    snakeY += snakeYChange;
    if (snakeX === foodX && snakeY === foodY) {
        score += 10;
        updateScore(); // 更新分数
        generateFood();
    } else {
        snakeBody.pop();
    }
    snakeBody.unshift({ x: snakeX, y: snakeY });
    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || checkCollision()) {
        clearInterval(gameLoop);
        alert("Game Over! Your Score: " + score);
        document.getElementById('startBtn').disabled = false;
        return;
    }
    draw();
    drawGrid();
    changeDirection = false; // 重置方向改变标记
}

function checkCollision() {
    for (let i = 1; i < snakeBody.length; i++) {
        if (snakeX === snakeBody[i].x && snakeY === snakeBody[i].y) {
            return true;
        }
    }
    return false;
}

document.addEventListener("keydown", (event) => {
    if (changeDirection) return; // 如果方向已经改变，则忽略此次按键事件

    if (event.key === "ArrowLeft" && snakeXChange !== BLOCK_SIZE) snakeXChange = -BLOCK_SIZE, snakeYChange = 0;
    if (event.key === "ArrowRight" && snakeXChange !== -BLOCK_SIZE) snakeXChange = BLOCK_SIZE, snakeYChange = 0;
    if (event.key === "ArrowUp" && snakeYChange !== BLOCK_SIZE) snakeYChange = -BLOCK_SIZE, snakeXChange = 0;
    if (event.key === "ArrowDown" && snakeYChange !== -BLOCK_SIZE) snakeYChange = BLOCK_SIZE, snakeXChange = 0;

    changeDirection = true; // 标记方向已经改变
});


function startGame() {
    if (gameLoop) {
        clearInterval(gameLoop);
    }
    // 重置蛇的位置
    snakeX = Math.floor(canvas.width / 2 / BLOCK_SIZE) * BLOCK_SIZE - 20;
    snakeY = Math.floor(canvas.height / 2 / BLOCK_SIZE) * BLOCK_SIZE - 20;
    snakeXChange = BLOCK_SIZE;
    snakeYChange = 0;
    snakeBody = [];
    score = 0; // 重置分数
    updateScore(); // 更新分数显示
    generateFood();
    gameLoop = setInterval(update, SNAKE_SPEED);
    drawGrid();
}

document.getElementsByName('speed').forEach(radio => {
    radio.addEventListener('change', (event) => {
        SNAKE_SPEED = event.target.value;
    });
});

document.getElementsByName('size').forEach(radio => {
    radio.addEventListener('change', (event) => {
        setBoardSize(event.target.value);
        drawGrid(); // 重新绘制网格以匹配新大小
    });
});

window.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault(); // 阻止默认的滚动行为
    }
});

document.getElementById('startBtn').addEventListener('click', startGame);

document.getElementById('instructionsButton').addEventListener('click', function() {
    var instructions = document.getElementById('instructions');
    if (instructions.style.display === 'none') {
        instructions.style.display = 'block';
    } else {
        instructions.style.display = 'none';
    }
});

drawGrid();