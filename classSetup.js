class HitBox {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    intersects(hitbox) {
        if (this.x + this.width > hitbox.x &&
            this.x < hitbox.x + hitbox.width &&
            this.y > hitbox.y - hitbox.height &&
            this.y - this.height < hitbox.y) {
            return true;
        }
        return false;
    }
}

class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Sprite {
    constructor(position, width, height, color) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw() {
        context.beginPath();
        context.fillStyle = this.color;
        context.fillRect(this.position.x, this.position.y, this.width, this.height);
        context.closePath();
    }
}

class Label {
    constructor(font, text, position, color) {
        this.font = font;
        this.text = text;
        this.position = position;
        this.color = color;
    }

    draw() {
        context.beginPath();
        context.font = this.font;
        context.fillStyle = this.color;
        context.fillText(this.text, this.position.x, this.position.y);
        context.closePath();
    }
}

class SnakePiece extends Sprite {
    hitbox() {
        return new HitBox(this.position.x, this.position.y, this.width, this.height);
    }

    constructor(position, size, speed, color) {
        super(position, size, size, color);
        this.currentDirection = snakeDirection.None;
        this.nextDirection = snakeDirection.None;
        this.speed = speed;
    }

    update() {
        switch (this.nextDirection) {
            case snakeDirection.Up:
                if (this.position.y % this.height == 0) {
                    this.currentDirection = this.nextDirection;
                    this.nextDirection = snakeDirection.None;
                }
                break;
            case snakeDirection.Down:
                if (this.position.y % this.height == 0) {
                    this.currentDirection = this.nextDirection;
                    this.nextDirection = snakeDirection.None;
                }
                break;
            case snakeDirection.Left:
                if (this.position.x % this.width == 0) {
                    this.currentDirection = this.nextDirection;
                    this.nextDirection = snakeDirection.None;
                }
                break;
            case snakeDirection.Right:
                if (this.position.x % this.width == 0) {
                    this.currentDirection = this.nextDirection;
                    this.nextDirection = snakeDirection.None;
                }
                break;
        }

        if (this.currentDirection == snakeDirection.Left) {
            this.position.x -= this.speed;
        }
        else if (this.currentDirection == snakeDirection.Right) {
            this.position.x += this.speed;
        }
        else if (this.currentDirection == snakeDirection.Up) {
            this.position.y -= this.speed;
        }
        else if (this.currentDirection == snakeDirection.Down) {
            this.position.y += this.speed;
        }
    }

    draw() {
        context.beginPath();
        context.lineWidth = 4;
        context.strokeStyle = "#80bdff";
        context.strokeRect(this.position.x, this.position.y, this.width, this.height);
        context.closePath();
        super.draw();
    }
}

class Food extends Sprite {
    hitbox() {
        return new HitBox(this.position.x, this.position.y, this.width, this.height);
    }

    constructor(position, size, color) {
        super(position, size, size, color);
    }
}
