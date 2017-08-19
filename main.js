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
        sword.x--;
        sword.y++
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
    if (stateHandler.gameLoop) {
        if (e.keyCode == keys.SPACE) {
            knight.y += 80;

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
}

function Sword() {
    //The sword originates from the centre of the Knight
    this.length = knight.radius *3;
    this.x = 0;
    this.y = 0;

    this.draw = function() {
        ctx.beginPath();
        ctx.moveTo(knight.x, knight.y);
        ctx.lineTo(knight.x + this.x, knight.y + this.y - this.length);
        ctx.strokeStyle="#c2c4ae";
        ctx.stroke();
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
