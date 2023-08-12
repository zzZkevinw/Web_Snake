const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const BLOCK_SIZE = 10; // 这里保持 BLOCK_SIZE 为常量
const SMOOTH_FACTOR = 5; // 平滑因子，控制每次更新移动的距离
let SNAKE_SPEED = 250 / SMOOTH_FACTOR; // 更新速度
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

let nextDirection = null; // 在全局范围内定义


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

const GROWTH_FACTOR = 4; // 每次吃掉食物后增长的长度
function update() {
    const totalBlocks = (canvas.width / BLOCK_SIZE) * (canvas.height / BLOCK_SIZE); // 计算屏幕上的总区块数

    // 检查蛇头是否与网格完全对齐
    if (snakeX % BLOCK_SIZE === 0 && snakeY % BLOCK_SIZE === 0 && nextDirection) {
        snakeXChange = nextDirection.x;
        snakeYChange = nextDirection.y;
        nextDirection = null; // 清除下一个方向
    }

    snakeX += snakeXChange / SMOOTH_FACTOR;
    snakeY += snakeYChange / SMOOTH_FACTOR;

    // 检查蛇头是否与墙壁有交集
    if (snakeX < 0 || snakeX + BLOCK_SIZE > canvas.width ||
        snakeY < 0 || snakeY + BLOCK_SIZE > canvas.height ||
        checkCollision()) {
        clearInterval(gameLoop);
        alert("Game Over! Your Score: " + score);
        document.getElementById('startBtn').disabled = false;
        return;
    }
    // 检查蛇头是否与食物有交集
    if (snakeX < foodX + BLOCK_SIZE &&
        snakeX + BLOCK_SIZE > foodX &&
        snakeY < foodY + BLOCK_SIZE &&
        snakeY + BLOCK_SIZE > foodY) {
        score += 10;
        updateScore(); // 更新分数
        generateFood();

        // 增加 GROWTH_FACTOR 个块到蛇的身体
        for (let i = 0; i < GROWTH_FACTOR; i++) {
            snakeBody.push({}); // 添加空对象，长度会在后续逻辑中更新
        }
    } else {
        snakeBody.pop();
    }

    snakeBody.unshift({ x: snakeX, y: snakeY });

    // 检查是否胜利
    if (snakeBody.length === totalBlocks) {
        clearInterval(gameLoop);
        alert("Congratulations! You win! Your Score: " + score);
        document.getElementById('startBtn').disabled = false;
        return;
    }

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
    if (event.key === ' ') {
        startGame(); // 当按下空格键时，开始或重新开始游戏
        return; // 返回，以防止进一步处理此事件
    }
    if (changeDirection) return; // 如果方向已经改变，则忽略此次按键事件

    let newDirection = null;
    if (event.key === "ArrowLeft" && snakeXChange !== BLOCK_SIZE) newDirection = { x: -BLOCK_SIZE, y: 0 };
    if (event.key === "ArrowRight" && snakeXChange !== -BLOCK_SIZE) newDirection = { x: BLOCK_SIZE, y: 0 };
    if (event.key === "ArrowUp" && snakeYChange !== BLOCK_SIZE) newDirection = { x: 0, y: -BLOCK_SIZE };
    if (event.key === "ArrowDown" && snakeYChange !== -BLOCK_SIZE) newDirection = { x: 0, y: BLOCK_SIZE };

    if (newDirection) {
        nextDirection = newDirection;
    }

    changeDirection = true; // 标记方向已经改变
});



function startGame() {
    // 检查是否选择了自定义大小但没有输入值
    if (document.getElementById('customSize').checked && !document.getElementById('customSizeValue').value) {
        alert("请在自定义大小框中输入一个值!");
        return; // 不开始游戏，直接返回
    }
    // 检查是否选择了自定义速度但没有输入值
    if (document.getElementById('customSpeed').checked && !document.getElementById('customSpeedValue').value) {
        alert("请在自定义速度框中输入一个值!");
        return; // 不开始游戏，直接返回
    }
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
document.getElementById('customSpeed').addEventListener('change', function() {
    document.getElementById('customSpeedValue').style.display = 'inline';
    SNAKE_SPEED = document.getElementById('customSpeedValue').value / SMOOTH_FACTOR; // 使用自定义速度值
});

document.getElementById('customSpeedValue').addEventListener('input', function(event) {
    if (document.getElementById('customSpeed').checked) { // 只有在自定义速度选项被选中时才更新速度
        SNAKE_SPEED = event.target.value / SMOOTH_FACTOR;
    }
});

document.getElementsByName('speed').forEach(radio => {
    radio.addEventListener('change', (event) => {
        if (event.target.value !== 'custom') {
            // document.getElementById('customSpeedValue').style.display = 'none';
            SNAKE_SPEED = event.target.value / SMOOTH_FACTOR; // 使用选中的速度值
        }
    });
});

document.getElementById('customSizeValue').addEventListener('input', function(event) {
    this.value = this.value.replace(/[^0-9]/g, '');
});

document.getElementById('customSpeedValue').addEventListener('input', function(event) {
    this.value = this.value.replace(/[^0-9]/g, '');
});

document.getElementById('customSize').addEventListener('change', function() {
    document.getElementById('customSizeValue').style.display = 'inline';
    setBoardSize(document.getElementById('customSizeValue').value); // 使用自定义大小值
});

document.getElementById('customSizeValue').addEventListener('input', function(event) {
    if (document.getElementById('customSize').checked) { // 只有在自定义大小选项被选中时才更新大小
        setBoardSize(event.target.value);
    }
});

document.getElementsByName('size').forEach(radio => {
    radio.addEventListener('change', (event) => {
        if (event.target.value !== 'custom') {
            // document.getElementById('customSizeValue').style.display = 'none';
            setBoardSize(event.target.value); // 使用选中的大小值
        }
    });
});


window.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === ' ') {
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