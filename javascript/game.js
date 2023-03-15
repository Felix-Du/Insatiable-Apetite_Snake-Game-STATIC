/*
 * Author: Felix Du
 * Date Created: December 2, 2020
 * Description: A snake game where the user can track their best scores
 */
window.addEventListener("load", function () {

    // Game scores (For static version only)
    best_score = 0;

    document.getElementById("play_again").addEventListener("click", function (event) {
        startGame();
        $("#play_again").hide();
    })

    document.getElementById("show_scores").addEventListener("click", function (event) {
        displayScores();
    })

    let tile_size = 20;

    // Create canvas
    let canvas = document.getElementById("gameCanvas");
    let context = canvas.getContext("2d");


    // Set canvas size
    let width = Math.round(canvas.getBoundingClientRect().width / tile_size) * tile_size;
    let height = Math.round(canvas.getBoundingClientRect().height / tile_size) * tile_size;
    canvas.width = width;
    canvas.height = height;

    let startY = Math.floor((canvas.height / tile_size) / 2) * tile_size;

    // Snake object for the game
    function Snake() {
        this.location = [{
            x,
            y
        }] = [{
            x: 200,
            y: startY
        }, {
            x: 180,
            y: startY
        }, {
            x: 160,
            y: startY
        }, {
            x: 140,
            y: startY
        },];
        this.head; // Dictates the direction the snake moves
        this.draw = function (c) {          // Draws the snake onto the canvas
            context.fillStyle = "white";
            for (let i = 0; i < snake.location.length; i++) {
                c.fillRect(this.location[i].x, this.location[i].y, tile_size, tile_size);
            }
        }
    }

    // Fruit object that increases the size of the snake
    function Fruit() {
        this.x;
        this.y;
        this.generateNewFruit = function () {   // Generates a new fruit onto the canvas
            this.x = parseInt(Math.random() * (canvas.width / tile_size)) * tile_size;
            this.y = parseInt(Math.random() * (canvas.height / tile_size)) * tile_size;
        }
        this.draw = function (c) {  // Draws fruit onto the canvas
            c.fillStyle = "red";
            c.fillRect(this.x, this.y, tile_size, tile_size);
        }
    }

    // Create snake variable to store snake object
    let snake;

    // Create fruit variable to store fruit object
    let fruit;

    // Key inputs
    let left = 37,
        up = 38,
        right = 39,
        down = 40;

    // Snake movement interval
    let moveInterval = 90;
    // Start flag for the game
    let start;
    // Game over flag
    let gameOver;

    document.addEventListener("keydown", function (event) {
        event.preventDefault();
        let key = event.keyCode;
        if (start == true) {
            if (key != left) {
                if (key === up || key === right || key === down) {
                    start = false;
                    move(key);
                    checkMove(key);
                }
            }
        } else {
            if (gameOver == false) {
                checkMove(key);
            }
        }
    });

    // Variable for the movement function
    let myMove;
    // Movement amount for right/left
    let moveX;
    // Movement amount for up/down
    let moveY;
    // Snake object that gets drawn when the user collides with a wall
    let oldSnake = [];

    // Sets movement function
    function move() {
        myMove = setInterval(function () {
            //  Set old snake
            for (let i = 0; i < snake.location.length; i++) {
                oldSnake[i] = snake.location[i];
            }

            // Set snake head coordinates
            snake.head = {
                x: snake.location[0].x,
                y: snake.location[0].y
            };

            // Move snake
            snake.head.x += moveX;
            snake.head.y += moveY;

            // See if fruit was obtained
            checkFruit = checkGetFruit();
            if (checkFruit) {
                snake.location.unshift(snake.head);
            } else {
                snake.location.unshift(snake.head);
                snake.location.pop();
            }
            checkGameOver()
            draw();
        }, moveInterval);
    }

    let prevKey;
    // Checks to see what key the user has pressed and makes sure they can't move in the opposite direction
    function checkMove(key) {
        if (key == left && prevKey != right) {
            moveX = -tile_size;
            moveY = 0;
            prevKey = left;
        } else if (key == up && prevKey != down) {
            moveX = 0;
            moveY = -tile_size;
            prevKey = up;
        } else if (key == right && prevKey != left) {
            moveX = tile_size;
            moveY = 0;
            prevKey = right;
        } else if (key == down && prevKey != up) {
            moveX = 0;
            moveY = tile_size;
            prevKey = down;
        }
    }

    // Checks to see if the snake has gotten the fruit
    function checkGetFruit() {
        if (snake.head.x == fruit.x && snake.head.y == fruit.y) {
            fruit.generateNewFruit();
            draw();
            return true;
        } else {
            return false;
        }
    }

    // Redraws canvas
    function draw() {
        context.fillStyle = "black";
        context.fillRect(0, 0, canvas.width, canvas.height);
        fruit.draw(context);
        snake.draw(context);
        if (gameOver) {
            context.fillStyle = "white";
            for (let i = 0; i < oldSnake.length; i++) {
                context.fillRect(oldSnake[i].x, oldSnake[i].y, tile_size, tile_size);
            }
        }
    }

    // Checks if the game will end
    function checkGameOver() {
        // Check if snake has collided with itself
        for (let i = 0; i < snake.location.length - 1; i++) {
            for (let n = i + 1; n < snake.location.length; n++) {
                if (snake.location[i].x === snake.location[n].x && snake.location[i].y == snake.location[n].y) {
                    gameEnd();
                }
            }
        }
        // Check if snake has collided with the wall borders
        if (snake.head.x <= 0 - tile_size || snake.head.x >= canvas.width || snake.head.y <= 0 - tile_size || snake.head.y >= canvas.height) {
            gameEnd();
        }
    }

    function startGame() {
        context.fillStyle = "black";
        context.fillRect(0, 0, canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height);

        // Create new snake
        snake = new Snake();
        // Draw snake onto canvas
        snake.draw(context);
        // Create new fruit
        fruit = new Fruit();
        // Generate fruit placement
        fruit.generateNewFruit();
        // Draw fruit onto canvas
        fruit.draw(context);

        // Set initialised variables
        start = true;
        gameOver = false;
        moveX = 0;
        moveY = 0;
        oldSnake = [];
        prevKey = right;
    }

    // Ends the game
    function gameEnd() {
        gameOver = true;
        console.log("GAME OVER");
        clearInterval(myMove);
        displayScores();
    }

    // Displays the scores
    function displayScores() {
        let score = (snake.location.length - 4) * 10;
        if (score >= best_score) {
            best_score = score;
        }
        document.getElementById("scores").innerHTML = "";

        // Create score table
        $("#scores").append("<tr id = 'column'>" +
            "<th>Score</th>" +
            "<th>Best Score</th>" +
            "</tr>");

        $("#scores").append("<tr id = 'user'><td>" + score + "</td>" +
            "<td>" + best_score + "</td></tr>");
        1
        $("#rank").css({
            color: "black",
            backgroundColor: "white"
        });

        $("#column").css({
            border: "1px solid black",
            color: "black",
            backgroundColor: "white"
        });

        $("#gold").css({
            border: "1px solid white",
            color: "white",
            backgroundColor: "gold"
        });

        $("#silver").css({
            border: "1px solid grey",
            color: "grey",
            backgroundColor: "silver"
        });

        $("#bronze").css({
            border: "1px solid #b87333",
            color: "black",
            backgroundColor: "#b87333"
        });


        $("#user").css({
            border: "1px solid white",
            color: "white",
            backgroundColor: "lightblue"
        });

        // Display scores
        $("#overlay").fadeIn("slow", function () {
            $("#scores").fadeIn("fast");
            $("#scores").animate({
                marginTop: "50px"
            }, {
                duration: 500
            });
        });

        $("#play_again").css({
            display: "inline",
            textAlign: "center"
        });
    }

    startGame();

    // Removes the score table from the screen
    document.getElementById("overlay").addEventListener("click", function (event) {
        $("#overlay").fadeOut("fast");
        $("#scores").slideUp("slow");
    })

});