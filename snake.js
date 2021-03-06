function init() {
    var width = 65;
    var height = 40;

    var ctx;
    var turn = [];

    var xV = [-1, 0, 1, 0];
    var yV = [0, -1, 0, 1];

    var map = [];
    var MR = Math.random;

    function Snake() {
        this.X = 5 + (MR() * (width - 10)) | 0;
        this.Y = 5 + (MR() * (height - 10)) | 0;
        this.direction = MR() * 3 | 0;
        this.tail = [];
        this.elements = 1;
        return this;
    }

    var snake1 = new Snake();
    var snake2 = new Snake();
    var snakes = [snake1, snake2];
    var interval = 0;
    var score = 0;
    var inc_score = 50;
    var sum = 0, easy = true;
    var i, dir;
    var win = window;
    var doc = document;
    var canvas = doc.createElement('canvas');
    var setInt = win.setInterval;
    var clInt = win.clearInterval;
    for (i = 0; i < width; i++) {
        map[i] = [];
    }

    canvas.setAttribute('width', width * 10);
    canvas.setAttribute('height', height * 10);
    ctx = canvas.getContext('2d');
    doc.body.appendChild(canvas);
    function placeFood() {
        var x, y;
        do {
            x = MR() * width | 0;
            y = MR() * height | 0;
        } while (map[x][y]);
        map[x][y] = 1;
        ctx.strokeRect(x * 10 + 1, y * 10 + 1, 10 - 2, 10 - 2);
    }

    placeFood();
    placeFood();
    function restart() {
        ctx.clearRect(0, 0, width * 10, height * 10);
        map = [];

        for(i= 0; i< snakes.length; i++){
            var snake = snakes[i];
            snake.X = 5 + (MR() * (width - 10)) | 0;
            snake.Y = 5 + (MR() * (height - 10)) | 0;
            snake.direction = MR() * 3 | 0;
            snake.elements = 1;
            snake.tail = [];
        }

        score = 0;
        inc_score = 50;

        for (i = 0; i < width; i++) {
            map[i] = [];
        }
        placeFood();
        placeFood();
    }

    function clock() {
        if (easy) {
            for(i= 0; i< snakes.length; i++) {
                var snake = snakes[i];
                snake.X = (snake.X + width) % width;
                snake.Y = (snake.Y + height) % height;
            }
        }
        --inc_score;

        if ((easy || (0 <= snake1.X && 0 <= snake1.Y && snake1.X < width && snake1.Y < height)) && 2 !== map[snake1.X][snake1.Y]) {
            if (1 === map[snake1.X][snake1.Y]) {
                score += Math.max(5, inc_score);
                inc_score = 50;
                placeFood();
                snake1.elements++;
            }

            ctx.fillRect(snake1.X * 10, snake1.Y * 10, 10 - 1, 10 - 1);
            map[snake1.X][snake1.Y] = 2;
            snake1.tail.unshift([snake1.X, snake1.Y]);

            snake1.X += xV[snake1.direction];
            snake1.Y += yV[snake1.direction];

            if (snake1.elements < snake1.tail.length) {
                dir = snake1.tail.pop()

                map[dir[0]][dir[1]] = 0;
                ctx.clearRect(dir[0] * 10, dir[1] * 10, 10, 10);
            }

        } else if (!turn.length) {
            restart();
        }
        if ((easy || (0 <= snake2.X && 0 <= snake2.Y && snake2.X < width && snake2.Y < height)) && 2 !== map[snake2.X][snake2.Y]) {
            if (1 === map[snake2.X][snake2.Y]) {
                score += Math.max(5, inc_score);
                inc_score = 50;
                placeFood();
                snake2.elements++;
            }

            ctx.fillRect(snake2.X * 10, snake2.Y * 10, 10 - 1, 10 - 1);
            map[snake2.X][snake2.Y] = 2;
            snake2.tail.unshift([snake2.X, snake2.Y]);

            snake2.X += xV[snake2.direction];
            snake2.Y += yV[snake2.direction];

            if (snake2.elements < snake2.tail.length) {
                dir = snake2.tail.pop()

                map[dir[0]][dir[1]] = 0;
                ctx.clearRect(dir[0] * 10, dir[1] * 10, 10, 10);
            }

        } else if (!turn.length) {
            restart();
        }
    }

    interval = setInt(clock, 120);

    doc.onkeydown = function (e) {

        var code = e.keyCode - 37;

        /*
         * 0: left
         * 1: up
         * 2: right
         * 3: down
         **/
        if (0 <= code && code < 4 && code !== turn[0]) {
            //turn.unshift(code);
            snake1.direction = code;
        } else if(e.keyCode == 65) {
            snake2.direction = 0;
        } else if(e.keyCode == 87) {
            snake2.direction = 1;
        } else if(e.keyCode == 68) {
            snake2.direction = 2;
        } else if(e.keyCode == 83) {
            snake2.direction = 3;
        }
    }
}