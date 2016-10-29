//Initialize the paddle
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// starting position of ball and ball radius
var x = canvas.width/2;
var y = canvas.height - 30;
var ball_radius = 10;

// paddle ---------
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;

// user lives ---
var lives = 5;
var score = 0;
var level = 1;

// bricks ------------
var brickRowCount = level;
var brickColumnCount = level;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var brickCount = brickRowCount * brickColumnCount;

var items = [];

// initialize bricks
var bricks = [];
for(c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1, item: -1, color: getRandomColor()};
    }
}

// end bricks ----------------


var right_key_pressed = false;
var left_key_pressed = false;

// ball speed
var delta_x = 5;
var delta_y = -5;

draw();

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function collisionDetection() {
    for(c=0; c < brickColumnCount; c++) {
        for(r=0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1 && x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                delta_y = -delta_y;
                b.status = 0;
                score += 10;
                brickCount--;

                if(brickCount == 0){
                    alert("You won this level");
                    setupNextLevel();
                    return;
                }
            }
        }
    }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw_ball();
    draw_paddle();
    collisionDetection();
    draw_bricks();
    draw_score();
    draw_life();

    if(y + delta_y < ball_radius ){
        delta_y = -delta_y;
    } else if(y + delta_y > canvas.height - ball_radius){
        if(x > paddleX && x < paddleX + paddleWidth) {
            delta_y = -delta_y;
        } else {
            decrement_life();
        }
    }

    if(x + delta_x < ball_radius  || x + delta_x > canvas.width - ball_radius){
        delta_x = -delta_x;
    }

    if(right_key_pressed && (paddleX < canvas.width - paddleWidth)) {
        paddleX += 7;
    }
    else if(left_key_pressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += delta_x;
    y += delta_y;

    requestAnimationFrame(draw);
}

function draw_ball(){
    ctx.beginPath();
    ctx.arc(x, y, ball_radius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}


function draw_paddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function draw_bricks() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 0){
                continue;
            }
            var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
            var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = bricks[c][r].color;
            ctx.fill();
            ctx.closePath();
        }
    }
}

function draw_score(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+ score, 8, 20);

}

function setupNextLevel(){
    brickColumnCount = ++level;
    brickRowCount = ++level;
    brickCount = brickColumnCount * brickRowCount;
    x = canvas.width/2;
    y = canvas.height - 30;
    paddleX = (canvas.width-paddleWidth)/2;

    setup_bricks();

}

function setup_bricks(){
    bricks = [];
    for(c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for(r=0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1, item: -1, color: getRandomColor()};
        }
    }
}

function draw_life(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+ lives, canvas.width - 100, 20);
}

function decrement_life(){
    lives--;
    if(lives <= 0){
        alert("GAME OVER!");
        document.location.reload();
    } else{
        alert("You lost a life.  Ready to start again?");
        x = canvas.width/2;
        y = canvas.height - 30;
        delta_x = 2;
        delta_y = -2;
        paddleX = (canvas.width-paddleWidth)/2;
    }
}


function keyDownHandler(e) {
    if(e.keyCode == 39) {
        right_key_pressed = true;
    }
    else if(e.keyCode == 37) {
        left_key_pressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        right_key_pressed = false;
    }
    else if(e.keyCode == 37) {
        left_key_pressed = false;
    }
}
