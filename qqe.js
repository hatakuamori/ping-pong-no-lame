const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 1000; // Увеличено
canvas.height = 700; // Увеличено

// переменные
const paddleWidth = 10;
const paddleHeight = 120; // Увеличено
const ballSize = 10;

const paddles = [
    { x: 10, y: canvas.height / 2 - paddleHeight / 2, dy: 0, keyUp: 'w', keyDown: 's' }, // Левая ракетка
    { x: canvas.width - 20, y: canvas.height / 2 - paddleHeight / 2, dy: 0, keyUp: 'ArrowUp', keyDown: 'ArrowDown' }, // Правая ракетка
];

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: 2, // Замедлено
    dy: 2,
};

let leftScore = 0;
let rightScore = 0;

const moonTexture = new Image();
moonTexture.src = 'grizly-club-p-zheltaya-luna-na-belom-fone-18.png';  // Укажите путь к изображению Луны


// Управление через клавиатуру
document.addEventListener('keydown', (e) => {
    paddles.forEach((paddle) => {
        if (e.key === paddle.keyUp) paddle.dy = -5; // Вверх
        if (e.key === paddle.keyDown) paddle.dy = 5; // Вниз
    });
});

document.addEventListener('keyup', (e) => {
    paddles.forEach((paddle) => {
        if (e.key === paddle.keyUp || e.key === paddle.keyDown) paddle.dy = 0; // Остановить движение
    });
});

// Управление через кнопки
document.getElementById('leftUpBtn').addEventListener('click', () => {
    paddles[0].dy = -5; // Двигаем левую ракетку вверх
});
document.getElementById('leftDownBtn').addEventListener('click', () => {
    paddles[0].dy = 5; // Двигаем левую ракетку вниз
});
document.getElementById('rightUpBtn').addEventListener('click', () => {
    paddles[1].dy = -5; // Двигаем правую ракетку вверх
});
document.getElementById('rightDownBtn').addEventListener('click', () => {
    paddles[1].dy = 5; // Двигаем правую ракетку вниз
});

// Сброс движения после отпускания кнопки
document.getElementById('leftUpBtn').addEventListener('mouseup', () => {
    paddles[0].dy = 0;
});
document.getElementById('leftDownBtn').addEventListener('mouseup', () => {
    paddles[0].dy = 0;
});
document.getElementById('rightUpBtn').addEventListener('mouseup', () => {
    paddles[1].dy = 0;
});
document.getElementById('rightDownBtn').addEventListener('mouseup', () => {
    paddles[1].dy = 0;
});

// Игровой цикл
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Отображение голевых зон
    ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
    ctx.fillRect(0, 0, 30, canvas.height); // Левая голевая зона
    ctx.fillRect(canvas.width - 30, 0, 30, canvas.height); // Правая голевая зона

    // Перемещение ракеток
    paddles.forEach((paddle) => {
        paddle.y += paddle.dy || 0;
        if (paddle.y < 0) paddle.y = 0;
        if (paddle.y + paddleHeight > canvas.height) paddle.y = canvas.height - paddleHeight;

        ctx.fillStyle = '#fff';
        ctx.fillRect(paddle.x, paddle.y, paddleWidth, paddleHeight);
    });

    // Перемещение мяча
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Столкновения с верхней и нижней стеной
    if (ball.y <= 0 || ball.y + ballSize >= canvas.height) ball.dy *= -1;

    // Столкновение мяча с ракетками
    paddles.forEach((paddle) => {
        if (
            ball.x < paddle.x + paddleWidth &&
            ball.x + ballSize > paddle.x &&
            ball.y < paddle.y + paddleHeight &&
            ball.y + ballSize > paddle.y
        ) {
            ball.dx *= -1.1; // Ускоряем мяч при каждом ударе
        }
    });

    // Проверка голов
    if (ball.x <= 0) {
        rightScore++;
        resetBall();
    }
    if (ball.x + ballSize >= canvas.width) {
        leftScore++;
        resetBall();
    }

    // Отображение мяча
    ctx.fillStyle = '#gggg';
    ctx.fillRect(ball.x, ball.y, ballSize, ballSize);

    // Отображение счета
    ctx.font = '30px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText(`${leftScore} : ${rightScore}`, canvas.width / 2 - 30, 30);

    requestAnimationFrame(gameLoop);
}

// Сброс мяча после гола
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 2 : -2); // Случайное направление
    ball.dy = (Math.random() > 0.5 ? 2 : -2);
}

gameLoop();
