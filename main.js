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
        gun.draw();
        enemies.drawAll();
        bullets.drawAll();
    }
    this.deathScreen = function() {
        ctx.font = "40pt Ariel";
        ctx.fillStyle = "#c2c4ae";
        ctx.fillText("You died", canvas.width/4, canvas.height/4);
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
        //Reset all class instances to default
        setup();        
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
            gun.shoot();

        }
    }
    else if (stateHandler.deathSequence) {
        if (e.keyCode == keys.SPACE) {
            stateHandler.returnToStartScreen();
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
        this.x = gun.x;
        this.y = gun.y;
        gun.move(tempX * 2, (tempY - this.y) * 2 );
        */
        var deltaX = gun.x - this.x;
        var deltaY = gun.y - this.y;
        this.x += deltaX;
        this.y += deltaY;
        gun.move(deltaX, deltaY);
    } 
}

function Gun() {
    //The gun originates from the centre of the Knight
    this.length = knight.radius * 2;
    this.x      = knight.x + this.length;
    this.y      = knight.y;
    this.angle  = 0.05;
    this.deltaX = 0;
    this.deltaY = 0;

    this.rotateSword = function() {
        this.deltaX = Math.cos(this.angle) * (this.x - knight.x) 
            - Math.sin(this.angle) * (this.y - knight.y) + knight.x;
        this.deltaY = Math.sin(this.angle) * (this.x - knight.x)
            + Math.cos(this.angle) * (this.y - knight.y) + knight.y;

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
    this.shoot = function(x, y) {
        dx = this.x - knight.x;
        dy = this.y - knight.y;
        bullets.onScreen.push(new Bullet(this.x, this.y, dx, dy));
    }
}

function Bullet(x, y, dx, dy) {
    /**
     * @x, y : floats representing the location of the bullet
     * @dx, dy : floats representing the change in the movement of the bullet
     */
    this.speed  = 0.1; 
    this.x      = x;
    this.y      = y;
    this.dx     = dx * this.speed;
    this.dy     = dy * this.speed;
    this.radius = 5;

    this.draw = function() {
        console.log(this.dx + " " + this.dy);
        ctx.beginPath();
        ctx.arc(this.x += this.dx, this.y += this.dy, this.radius, 0, Math.PI*2);
        ctx.fillStyle = this.colour;
        ctx.fill();
        ctx.closePath();
    }
}
 
function Bullets() {
    this.onScreen = [];

    this.drawAll = function() {
        for (i = 0; i < this.onScreen.length; i++) {
            this.onScreen[i].draw();
        }
    }
}

function Enemy() {
    this.x = Math.floor(Math.random() * 800);
    this.y = Math.floor(Math.random() * 600);
    this.radius = 20;
    this.colour = "#992738";

    this.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fillStyle = this.colour;
        ctx.fill();
        ctx.closePath()
    }
    
    this.move = function() {
        //Add Brownian style motion to the enemy
        var negativeChance = 1;
        if (Math.random() > 0.5) {
            negativeChance = -1;
        }

        this.x += Math.floor(Math.random() * 3) * negativeChance;
        this.y += Math.floor(Math.random() * 3) * negativeChance;
        
        // to add boundries in order to stop the enemy drifting off-screen
        //Left border
        if (this.x - this.radius < 0) {
            this.x += 6;
        }
        //Right border
        if (this.x + this.radius > canvas.width) {
            this.x -= 6;
        }
        //Bottom border
        if (this.y - this.radius < 0) {
            this.y += 6;
        }
        //Top border
        if (this.y + this.radius > canvas.height) {
            this.y -= 6;
        }
    }
}

function Enemies() {
    /**
     * Keeps an array of living Enemy objects
     */
    this.numberOfEnemies = 10;
    this.enemyArr = [];
    for (i = 0; i < this.numberOfEnemies; i++) {
        this.enemyArr.push(new Enemy());
    }

    this.detectKnightEnemyCollisions = function() {
        for (i = 0; i < this.enemyArr.length; i++) {
            var e = this.enemyArr[i];
            if (collider.detectCircleCollision(e.x, e.y, e.radius,
                knight.x, knight.y, knight.radius)) {
                    stateHandler.deathSequence();
                }
        }
    }

    this.detectBulletEnemyCollisions = function() {
        for (i = 0; i < bullets.onScreen.length; i++) {
            var b = bullets.onScreen[i];
            for (j = 0; j < this.enemyArr.length; j++) {
                var e = this.enemyArr[j];
                if (collider.detectCircleCollision(e.x, e.y, e.radius,
                    b.x, b.y, b.radius)) {
                        //Remove the enemy
                        this.enemyArr.splice(j, 1);
                        numberOfEnemies--;
                        break;
                    }
            }
        }
    }

    this.drawAll = function() {
        for (i = 0; i < this.enemyArr.length; i++) {
            this.enemyArr[i].draw();
            this.enemyArr[i].move();
        }
        this.detectKnightEnemyCollisions();
        this.detectBulletEnemyCollisions();
        console.log(this.enemyArr.length +  " " + bullets.onScreen.length);
    }
}

var collider = {
    /**
     *  Dictionary of helper functions for collisions
     */
    detectCircleCollision : function(ax, ay, aRadius, bx, by, bRadius) {
        /**
         * @ax, ay : Circle a's x and y coordinates 
         * @bx, by : Circle b's x and y coordinates 
         * @aRadius : 
         * returns true if the circles, a and b, collide.
         */
        var combinedRadii = aRadius + bRadius;
        if (Math.abs(ax - bx) < combinedRadii
            && Math.abs(ay - by) < combinedRadii) {
                return true;
            }
        else {
            return false;
        }
    }
}

var game;
var stateHandler;
var knight;     
var gun; 
var enemies;
var bullets;

function setup() {
    game         = new Game();
    stateHandler = new StateHandler();
    knight       = new Knight();
    gun          = new Gun();
    enemies      = new Enemies();
    bullets      = new Bullets();
}

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
setup();        
setInterval(draw, 10);
