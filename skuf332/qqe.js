const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

// переменные
const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;

const paddles = [
    { x: 10, y: canvas.height / 2 - paddleHeight / 2, dy: 0, keyUp: 'w', keyDown: 's' },
    { x: canvas.width - 20, y: canvas.height / 2 - paddleHeight / 2, dy: 0, keyUp: 'ArrowUp', keyDown: 'ArrowDown' },
    { x: canvas.width / 2 - paddleWidth / 2, y: 10, dx: 0, keyLeft: 'a', keyRight: 'd', horizontal: true },
    { x: canvas.width / 2 - paddleWidth / 2, y: canvas.height - 20, dx: 0, keyLeft: 'j', keyRight: 'l', horizontal: true },
    
];

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: 3,
    dy: 3,
};

// управление
document.addEventListener('keydown', (e) => {
    paddles.forEach((paddle) => {
        if (e.key === paddle.keyUp) paddle.dy = -5;
        if (e.key === paddle.keyDown) paddle.dy = 5;
        if (e.key === paddle.keyLeft) paddle.dx = -5;
        if (e.key === paddle.keyRight) paddle.dx = 5;
    });
});

document.addEventListener('keyup', (e) => {
    paddles.forEach((paddle) => {
        if (e.key === paddle.keyLeft) paddle.dx = -5;
        if (e.key === paddle.keyRight) paddle.dx = 5;
    });
});

// цикл (игровой)
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // перемещенние ракеток
    paddles.forEach((paddle) => {
        if (paddle.horizontal) {
            paddle.x += paddle.dx || 0;
            if (paddle.x < 0) paddle.x = 0;
            if (paddle.x + paddleWidth > canvas.width) paddle.x = canvas.width - paddleWidth;
        } else {
            paddle.y += paddle.dy || 0;
            if (paddle.y < 0) paddle.y = 0;
            if (paddle.y + paddleHeight > canvas.height) paddle.y = canvas.height - paddleHeight;
        }

        ctx.fillStyle = '#fff';
        if (paddle.horizontal) {
            ctx.fillRect(paddle.x, paddle.y, paddleWidth, paddleWidth);
        } else {
            ctx.fillRect(paddle.x, paddle.y, paddleWidth, paddleHeight);
        }
    });

    //положения мяча
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Столкновения (стены)
    if (ball.y <= 0 || ball.y + ballSize >= canvas.height) ball.dy *= -1;
    if (ball.x <= 0 || ball.x + ballSize >= canvas.width) ball.dx *= -1;

    // столкновение с (моделькой)
    paddles.forEach((paddle) => {
        if (
            ball.x < paddle.x + paddleWidth &&
            ball.x + ballSize > paddle.x &&
            ball.y < paddle.y + paddleHeight &&
            ball.y + ballSize > paddle.y
        ) {
            ball.dx *= -1;
            if (!paddle.horizontal) ball.dy *= -1;
        }
        
    });

    //мяч моделька
    ctx.fillStyle = '#fff';
    ctx.fillRect(ball.x, ball.y, ballSize, ballSize);

    requestAnimationFrame(gameLoop);
}

gameLoop();
