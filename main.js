var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

window.addEventListener("keydown", eventHandler, false);

var keys = {
    SPACE : 32,
}

function Game() {
    this.startScreen = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "40pt Ariel";
        ctx.fillStyle = "#c2c4ae";
        ctx.fillText("Counter-Clockwise!", canvas.height/2-140, 100);
    }
    this.gameLoop = function() {
        knight.draw();
        sword.draw();
    }
    this.dead = function() {
    }
}

function StateHandler() {
    this.startScreen     = true;
    this.gameLoop        = false;
    this.dead            = false;

    this.returnToStartScreen = function() {
        this.startScreen = true;
        this.gameLoop    = false;
        this.dead        = false;
    }

    this.startGame = function() {
        this.startScreen = false;
        this.gameLoop    = true;
        this.dead        = false;
    }

    this.deathSequence = function() {
        this.startScreen = false;
        this.gameLoop    = false;
        this.dead        = true;
    }
}

function eventHandler(e) {
    /**
     * Chooses the correct keyevents depending upon the current state
     */
    //Check the current state
    if (stateHandler.startScreen) {

        if (e.keyCode == keys.SPACE) {
            stateHandler.startGame();
        }
    }
    else if (stateHandler.gameLoop) {
        if (e.keyCode == keys.SPACE) {
            knight.move();

        }

    }
}

function Knight() {
    this.x      = canvas.width/2;
    this.y      = canvas.height/2;
    this.radius = 20;
    this.colour = "#c2c4ae";

    this.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fillStyle = this.colour;
        ctx.fill();
        ctx.closePath();
    }
    this.move = function() {
        /*
        var tempX = this.x;
        var tempY = this.y;
        this.x = sword.x;
        this.y = sword.y;
        sword.move(tempX * 2, (tempY - this.y) * 2 );
        */
        var deltaX = sword.x - this.x;
        var deltaY = sword.y - this.y;
        this.x += deltaX;
        this.y += deltaY;
        sword.move(deltaX, deltaY);
    }
}

function Sword() {
    //The sword originates from the centre of the Knight
    this.length = knight.radius * 3;
    this.x = knight.x + this.length;
    this.y = knight.y;
    this.angle = 0.05;
    this.deltaX = 0;
    this.deltaY = 0;

    this.rotateSword = function() {
        this.deltaX = Math.cos(this.angle) * (this.x - knight.x) - Math.sin(this.angle) * (this.y - knight.y) + knight.x;
        this.deltaY = Math.sin(this.angle) * (this.x - knight.x) + Math.cos(this.angle) * (this.y - knight.y) + knight.y;

        this.x = this.deltaX;
        this.y = this.deltaY;
    }

    this.draw = function() {
        this.rotateSword();
        ctx.beginPath();
        ctx.moveTo(knight.x, knight.y);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle="#c2c4ae";
        ctx.lineWidth = 10;
        ctx.stroke();
    }
    this.move = function(x, y) {
        this.x += x;
        this.y += y;
    }
}

var game         = new Game();
var stateHandler = new StateHandler();
var knight       = new Knight();
var sword        = new Sword();


function draw() {
    // The main loop - checks the stateHandler and runs the appropriate loop
    if (stateHandler.startScreen) {
        game.startScreen();
    }
    else if (stateHandler.gameLoop) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        console.log("here");
        game.gameLoop();
    }
    else if (stateHandler.dead) {
        game.deathScreen();
    }
}

// call draw every 10ms
setInterval(draw, 10);
