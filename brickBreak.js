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


var right_key_pressed = false;
var left_key_pressed = false;


var delta_x = 2;
var delta_y = -2;

setInterval(draw, 10);

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw_ball();

    x += delta_x;
    y += delta_y;

    if(y + delta_y < ball_radius || y + delta_y > canvas.height - ball_radius){
        delta_y = -delta_y;
    }

    if(x + delta_x < ball_radius  || x + delta_x > canvas.width - ball_radius){
        delta_x = -delta_x;
    }
}

function draw_ball(){
    ctx.beginPath();
    ctx.arc(x, y, ball_radius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}


function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

