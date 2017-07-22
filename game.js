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
var food;
var isGameOver = false;

window.onload = () => {
    restartButton = document.getElementById("restart");
    restartButton.style.visibility = "hidden";

    canvasElement = document.getElementById("canvas");
    canvasElement.onkeydown = (event) => {
        //up
        if (event.keyCode == 87 || event.keyCode == 38) {
            if (snake[0].currentDirection != snakeDirection.Down)
                snake[0].nextDirection = snakeDirection.Up;
        }
        //down
        else if (event.keyCode == 83 || event.keyCode == 40) {
            if (snake[0].currentDirection != snakeDirection.Up)
                snake[0].nextDirection = snakeDirection.Down;
        }
        //left
        else if (event.keyCode == 65 || event.keyCode == 37) {
            if (snake[0].currentDirection != snakeDirection.Right)
                snake[0].nextDirection = snakeDirection.Left;
        }
        //right
        else if (event.keyCode == 68 || event.keyCode == 39) {
            if (snake[0].currentDirection != snakeDirection.Left)
                snake[0].nextDirection = snakeDirection.Right;
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

function restartClick() {
    snake = [];

    snake.push(new SnakePiece(new Vector2(20, 20), 20, 20, "#ff3333"));
    food = new Food(new Vector2(100, 200), 20, "yellow");
    scoreLabel.text = snake.length - 1;
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
    scoreLabel.position.x = canvasElement.width - context.measureText(snake.length - 1).width * 2;


    //head hits body and snake update
    for (var i = 0; i < snake.length; i++) {
        for (var j = 0; j < snake.length; j++) {
            if (i != j && snake[i].hitbox().intersects(snake[j].hitbox())) {
                console.log("lost");
                lose();
                break;
            }
        }
        snake[i].update();
    }

    //hitting walls
    if (snake[0].position.x < 0 || snake[0].position.x + snake[0].width > canvasElement.width || snake[0].position.y < 0 || snake[0].position.y + snake[0].height > canvasElement.height) {
        lose();
    }

    //following 
    for (var i = snake.length - 1; i > 0; i--) {
        snake[i].currentDirection = snake[i - 1].currentDirection;
    }

    //snake intersects with food
    if (snake[0].hitbox().intersects(food.hitbox())) {
        food.position = new Vector2(Math.round(Math.random() * (canvasElement.width - food.width / 2) - food.width / 2), Math.round(Math.random() * (canvasElement.height - food.height / 2) - food.height / 2));

        while (food.position.x % snake[0].width != 0) {
            food.position.x = Math.round(Math.random() * (canvasElement.width - food.width / 2) - food.width / 2);
        }

        while (food.position.y % snake[0].height != 0) {
            food.position.y = Math.round(Math.random() * (canvasElement.height - food.height / 2) - food.height / 2);
        }

        //create 5 more pieces
        for (var i = 0; i < 5; i++) {
            var newSnake = new SnakePiece(new Vector2(snake[snake.length - 1].position.x, snake[snake.length - 1].position.y), snake[snake.length - 1].width, snake[snake.length - 1].speed, snake[snake.length - 1].color);

            switch (snake[snake.length - 1].currentDirection) {
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

            newSnake.currentDirection = snake[snake.length - 1].currentDirection;

            snake.push(newSnake);
        }
        scoreLabel.text = (snake.length - 1) + 1000;

        console.log(food.position);
        console.log(snake.length);
    }
}

function updateScore(){
    
}

function draw() {
    for (var i = 0; i < snake.length; i++) {
        snake[i].draw();
    }

    food.draw();
    scoreLabel.draw();
}