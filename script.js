// select elements
const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let score = 0;

const brickRowCount = 9;
const brickColumnCount = 5;

// create a ball object with properties
// default place is in the middle of the canvas
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    speed: 4,
    dx: 4,
    dy: -4
};

// create a paddle object with properties
const paddle = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 20,
    w: 80,
    h: 10,
    speed: 8,
    dx: 0
};

// create brick properties
const brickInfo = {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true
}

// create the bricks
const bricks = [];
// iterate over rows
for(let i = 0; i < brickRowCount; i++) {
    // array for each row
    bricks[i] = [];
    // iterate over columns
    for(let j = 0; j < brickColumnCount; j++) {
        // change the properties
        const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
        const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
        // store the modified properties in an array
        bricks[i][j] = {x, y, ...brickInfo}
    }
}

// draw ball on canvas
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = 'seagreen';
    ctx.fill();
    ctx.closePath();
}

// draw the paddle on canvas
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = 'seagreen';
    ctx.fill();
    ctx.closePath();
}


// draw score on canvas
function drawScore() {
    ctx.font = '20px Courier New';
    ctx.fillText(`Score: ${score}`, canvas.width - 110, 30);
}

// draw the bricks
function drawBricks() {
    bricks.forEach(column => {
        column.forEach(brick => {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.w, brick.h);
            ctx.fillStyle = brick.visible ? 'seagreen' : 'transparent';
            ctx.fill();
            ctx.closePath();
        })
    })
}

// move paddle
function movePaddle() {
    paddle.x += paddle.dx;

    // detect the wall on the right side
    if(paddle.x + paddle.w > canvas.width){
        paddle.x = canvas.width - paddle.w;
    }

    // detect the wall on the left side
    if(paddle.x < 0){
        paddle.x = 0;
    }
}

// move ball
function moveBall() {
    // move horizontally
    ball.x += ball.dx;
    // move vertically
    ball.y += ball.dy;

    // wall collision on x asix - right / left
    if(ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
        ball.dx *= -1; // ball.dx = ball.dx * -1; reverse the direction
    }

    // wall collision top / bottom
    if(ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
        ball.dy *= -1; // reverse the direction
    }

    // paddle collision
    if(
        ball.x - ball.size  > paddle.x && // check the left side
        ball.x + ball.size < paddle.x + paddle.w && // check the right side
        ball.y + ball.size > paddle.y
    ){  
        ball.dy = -ball.speed; // reverse the direction
    }

    // brick collision
    bricks.forEach(column => {
        column.forEach(brick => {
            if(brick.visible) {
                if(
                    ball.x - ball.size > brick.x && // check left brick side
                    ball.x + ball.size < brick.x + brick.w && // check right brick side
                    ball.y + ball.size > brick.y && // check top brick side
                    ball.y - ball.size < brick.y + brick.h // check bottom brick side
                    ) {
                        ball.dy *= -1; // bounce it off
                        brick.visible = false;

                        increaseScore();
                    }
            }
        });
    });

    // if hit the bottom wall - lose
    if(ball.y + ball.size > canvas.height) { // collision with the bottom wall
        showAllBricks();
        score = 0;
    }
}

// increase score 
function increaseScore() {
    score++;

    if(score % (brickRowCount * brickRowCount) === 0) {
        // show all bricks / reset
        showAllBricks();
    }
}

function showAllBricks() {
    bricks.forEach(column => {
        column.forEach(brick => (brick.visible = true));
    });
}

// draw everything
function draw() {
    // clear canvas
    ctx.clearRect(0, 0 , canvas.width, canvas.height);

    drawBall();
    drawPaddle();
    drawScore();
    drawBricks();
}

function update() {

    movePaddle();
    moveBall();

    // draw everything
    draw();

    requestAnimationFrame(update);
}

update();

// keydown event
function keyDown(e) {
    if(e.key === 'Right' || e.key === 'ArrowRight') {
        paddle.dx = paddle.speed;
    } else if(e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = -paddle.speed;
    }
}

// keyup event
function keyUp(e){
    if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = 0;
    }
}

// listen for keyboad events
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// rules and event handlers
rulesBtn.addEventListener('click', () => rules.classList.add('show'));
closeBtn.addEventListener('click', () => rules.classList.remove('show'));