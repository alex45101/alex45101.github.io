var snakeDirection = {
    None: 0,
    Left: 1,
    Right: 2,
    Up: 3,
    Down: 4
};

var canvasElement;
var restartButton;
var context;
var scoreLabel;
var highScore;
var snake = [];
var ghostSnakeDict = {};
var nextSnake = 0;
var currentSnake;
var food;
var isGameOver = false;

var isSnowing = true;

var test;

window.onload = () => {
    restartButton = document.getElementById("restart");
    restartButton.style.visibility = "hidden";

    setGhostSnake();
    test = new Flake(new Vector2(100, 100), 50, new Vector2(0, 0), "#ffffff");

    canvasElement = document.getElementById("canvas");
    canvasElement.onkeydown = (event) => {
        //up
        if (event.keyCode == 87 || event.keyCode == 38) {
            if (snake[0].currentDirection != snakeDirection.Down) {
                snake[0].nextDirection = snakeDirection.Up;
            }
        }
        //down
        else if (event.keyCode == 83 || event.keyCode == 40) {
            if (snake[0].currentDirection != snakeDirection.Up) {
                snake[0].nextDirection = snakeDirection.Down;
            }
        }
        //left
        else if (event.keyCode == 65 || event.keyCode == 37) {
            if (snake[0].currentDirection != snakeDirection.Right) {
                snake[0].nextDirection = snakeDirection.Left;
            }
        }
        //right
        else if (event.keyCode == 68 || event.keyCode == 39) {
            if (snake[0].currentDirection != snakeDirection.Left) {
                snake[0].nextDirection = snakeDirection.Right;
            }
        }
    };
    canvasElement.setAttribute("tabindex", 0);
    canvasElement.focus();

    context = canvasElement.getContext("2d");

    if (localStorage["highScore"] === undefined) {
        localStorage["highScore"] = 0;
    }

    highScore = parseInt(localStorage["highScore"]);

    snake.push(new SnakePiece(new Vector2(20, 20), 20, 20, "#ff3333"));
    food = new Food(new Vector2(100, 200), 20, "yellow");
    scoreLabel = new Label("30px Arial", snake.length - 1, new Vector2(0, 40), "Black");

    setInterval(gameLoop, 50);
};

function setGhostSnake() {
    ghostSnakeDict[nextSnake] = {};
    ghostSnakeDict[nextSnake]["countDirection"] = 0;
    ghostSnakeDict[nextSnake]["snake"] = [];
    ghostSnakeDict[nextSnake]["snakeDirection"] = [];
    ghostSnakeDict[nextSnake]["food"] = {};
    ghostSnakeDict[nextSnake]["food"]["current"] = new Food(new Vector2(100, 200), 20, "#b5b54a");
    ghostSnakeDict[nextSnake]["food"]["pos"] = [];
    ghostSnakeDict[nextSnake]["food"]["count"] = 0;
}

function restartClick() {
    snake = [];

    currentSnake = nextSnake;
    nextSnake++;

    setGhostSnake();

    ghostSnakeDict[currentSnake]["snake"].push(new SnakePiece(new Vector2(20, 20), 20, 20, "#999999"));   

    snake.push(new SnakePiece(new Vector2(20, 20), 20, 20, "#ff3333"));
    food = new Food(new Vector2(100, 200), 20, "yellow");
    isGameOver = false;
    canvasElement.focus();

    restartButton.style.visibility = "hidden";
}

function lose() {
    isGameOver = true;
    restartButton.style.visibility = "visible";
}

function gameLoop() {
    if (!isGameOver) {
        context.clearRect(0, 0, canvasElement.width, canvasElement.height);
        update();
        draw();
    }
}

function update() {
    test.update();
    scoreLabel.position.x = canvasElement.width - context.measureText(snake.length - 1).width * 2;

    ghostSnakeDict[nextSnake]["snakeDirection"].push(snake[0].currentDirection);

    if (nextSnake > 0) {
        ghostSnakeDict[currentSnake]["snake"][0].nextDirection = ghostSnakeDict[currentSnake]["snakeDirection"][ghostSnakeDict[nextSnake]["countDirection"]];

        checkLosing(ghostSnakeDict[currentSnake]["snake"], true);
        following(ghostSnakeDict[currentSnake]["snake"]);
        intersectWithFood(ghostSnakeDict[currentSnake]["snake"], ghostSnakeDict[currentSnake]["food"]["current"], true);

        ghostSnakeDict[nextSnake]["countDirection"]++;
    }

    checkLosing(snake, false);
    following(snake);
    intersectWithFood(snake, food, false);

    scoreLabel.text = (snake.length - 1);
    console.log(food.position);
    console.log(snake.length);
}

function checkLosing(snakeArray, isGhost) {
    //head hits body and snake update
    for (var i = 0; i < snakeArray.length; i++) {
        for (var j = 0; j < snakeArray.length; j++) {
            if (i != j && snakeArray[i].hitbox().intersects(snakeArray[j].hitbox())) {
                console.log("lost");
                if (!isGhost) {
                    lose();
                }

                break;
            }
        }
        snakeArray[i].update();
    }

    //hitting walls
    if (snakeArray[0].position.x < 0 || snakeArray[0].position.x + snakeArray[0].width > canvasElement.width || snakeArray[0].position.y < 0 || snakeArray[0].position.y + snakeArray[0].height > canvasElement.height) {
        if (!isGhost) {
            lose();
        }
    }
}

function following(snakeArray) {
    //following 
    for (var i = snakeArray.length - 1; i > 0; i--) {
        snakeArray[i].currentDirection = snakeArray[i - 1].currentDirection;
    }
}

function intersectWithFood(snakeArray, foodToCheck, isGhost) {    

    //snake intersects with food
    if (snakeArray[0].hitbox().intersects(foodToCheck.hitbox())) {       
        if (!isGhost) {
            foodToCheck.position = new Vector2(Math.round(Math.random() * (canvasElement.width - foodToCheck.width / 2) - foodToCheck.width / 2), Math.round(Math.random() * (canvasElement.height - foodToCheck.height / 2) - foodToCheck.height / 2));

            while (foodToCheck.position.x % snakeArray[0].width != 0) {
                foodToCheck.position.x = Math.round(Math.random() * (canvasElement.width - foodToCheck.width / 2) - foodToCheck.width / 2);
            }

            while (foodToCheck.position.y % snakeArray[0].height != 0) {
                foodToCheck.position.y = Math.round(Math.random() * (canvasElement.height - foodToCheck.height / 2) - foodToCheck.height / 2);
            }

            ghostSnakeDict[nextSnake]["food"]["pos"].push(foodToCheck.position);
        } else {
            ghostSnakeDict[currentSnake]["food"]["current"].position = ghostSnakeDict[currentSnake]["food"]["pos"][ghostSnakeDict[currentSnake]["food"]["count"]];
            ghostSnakeDict[currentSnake]["food"]["count"]++;
        }

        //create 5 more pieces
        for (var i = 0; i < 5; i++) {
            var newSnake = new SnakePiece(new Vector2(snakeArray[snakeArray.length - 1].position.x, snakeArray[snakeArray.length - 1].position.y), snakeArray[snakeArray.length - 1].width, snakeArray[snakeArray.length - 1].speed, snakeArray[snakeArray.length - 1].color);

            switch (snakeArray[snakeArray.length - 1].currentDirection) {
                case snakeDirection.Up:
                    newSnake.position.y += newSnake.height;
                    break;
                case snakeDirection.Down:
                    newSnake.position.y -= newSnake.height;
                    break;
                case snakeDirection.Left:
                    newSnake.position.x += newSnake.width;
                    break;
                case snakeDirection.Right:
                    newSnake.position.x -= newSnake.width;
                    break;
            }

            newSnake.currentDirection = snakeArray[snakeArray.length - 1].currentDirection;

            snakeArray.push(newSnake);
        }
    }
}

function updateScore() {

}

function draw() {
    if (nextSnake > 0) {
        for (var i = 0; i < ghostSnakeDict[currentSnake]["snake"].length; i++) {
            ghostSnakeDict[currentSnake]["snake"][i].draw();
        }

        ghostSnakeDict[currentSnake]["food"]["current"].draw();
    }

    for (var i = 0; i < snake.length; i++) {
        snake[i].draw();
    }

    food.draw();
    test.draw();

    scoreLabel.draw();
}