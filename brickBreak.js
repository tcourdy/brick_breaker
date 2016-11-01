//Initialize the paddle
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// starting position of ball and ball radius
var x = canvas.width/2;
var y = canvas.height - 30;
var ball_radius = 10;

var isLooping;

// paddle ---------
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;

// user lives ---
var lives = 5;
var score = 0;
var level = 1;

// bricks ------------
var bricks = [];
var brickRowCount = level;
var brickColumnCount = level;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var brickCount = brickRowCount * brickColumnCount;


// item info
var dropped_item = {type: "", start_x: -1, start_y: -1};
var items = [];
var item_speed = -3;  //only in y direction


var right_key_pressed = false;
var left_key_pressed = false;

var item_dropped = false;

// ball speed
var delta_x = 5;
var delta_y = -5;

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

                // don't want to drop item after last brick only if more bricks remain.
                if(b.item == 1){
                    item_dropped = true;
                    dropped_item = {type: "", start_x: b.x, start_y: b.y};
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

    if(item_dropped){
        draw_item();

        if(dropped_item.start_x == paddleX && dropped_item.start_y == 0){ //item hit paddle
            // grant power up
        } else if(dropped_item.start_y > canvas.height){
            item_dropped = false;
        } else{
            item_dropped.start_y += item_speed;
        }
    }

    // update y position of ball
    if(y + delta_y < ball_radius ){
        delta_y = -delta_y;
    } else if(y + delta_y > canvas.height - ball_radius){
        if(x > paddleX && x < paddleX + paddleWidth) {
            delta_y = -delta_y;
        } else {
            decrement_life();
        }
    }

    // update x position of ball
    if(x + delta_x < ball_radius  || x + delta_x > canvas.width - ball_radius){
        delta_x = -delta_x;
    }


    // update paddle movement
    if(right_key_pressed && (paddleX < canvas.width - paddleWidth)) {
        paddleX += 7;
    }
    else if(left_key_pressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += delta_x;
    y += delta_y;

    isLooping = requestAnimationFrame(draw);
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
            // don't draw the brick if it has been destroyed
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
            item_prob = 1;//Math.floor(Math.random() * 10);
            bricks[c][r] = { x: 0, y: 0, status: 1, item: item_prob, color: getRandomColor()};
        }
    }

    if(!isLooping){
        draw();
    }
}

function draw_life(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+ lives, canvas.width - 100, 20);
}

function draw_item(){
    if(item_dropped){
        ctx.beginPath();
        ctx.arc(dropped_item.start_x, dropped_item.start_y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "yellow";
        ctx.fill();
        ctx.closePath();
    }
}

function decrement_life(){
    lives--;
    if(lives <= 0){
        alert("GAME OVER!");
        cancelAnimationFrame(isLooping);
    } else{
        alert("You lost a life.  Ready to start again?");
        x = canvas.width/2;
        y = canvas.height - 30;
        delta_x = 2;
        delta_y = -2;
        paddleX = (canvas.width-paddleWidth)/2;
        right_key_pressed = false;
        left_key_pressed = false;
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
