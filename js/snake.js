function init() {

    var width = 65;
    var height = 40;
    var ctx1;
    var ctx;
    var turn = [];

    var xV = [-1, 0, 1, 0];
    var yV = [0, -1, 0, 1];

    var map = [];
    var MR = Math.random;

    //using these two variable for assgining color to snakes
    var availableSnakeColors = ["#E6730E", "#9E0EE6"];
    var snakeCount = 0;

    var hitSpotX = -1;
    var hitSpotY = -1;
    var aggressorLength;
    var killGame;

    function Snake() {
        this.X = 5 + (MR() * (width - 10)) | 0;
        this.Y = 5 + (MR() * (height - 10)) | 0;
        this.score = 0;
        this.direction = MR() * 3 | 0;
        this.tail = [];
        this.elements = 1;
        this.color = availableSnakeColors[snakeCount];
        this.move = function () {
            //if canvas edges have to be wall, then easy should be false
            if(killGame == true){
                rollCredits();
            } else {
                if ((easy || (0 <= this.X && 0 <= this.Y && this.X < width && this.Y < height)) && (2 !== map[this.X][this.Y])) {
                    //check if a hit happened
                    if(hitSpotX != -1){
                        if(this.elements > 1){
                            //decide if the hitSpot is within the snake tail
                            var tailLengthBelowHitSpot = 0;
                            for(var i=0;i<this.elements;i++){
                                if(this.tail[i][0] == hitSpotX && this.tail[i][1] == hitSpotY ){
                                    tailLengthBelowHitSpot = this.elements - i;
                                    break;
                                }
                            }
                            if(aggressorLength > tailLengthBelowHitSpot){
                                this.elements -= tailLengthBelowHitSpot;
                                for(var j=0; j < tailLengthBelowHitSpot; j++){
                                    dir = this.tail.pop();
                                    map[dir[0]][dir[1]] = 0;
                                    ctx.clearRect(dir[0] * 10, dir[1] * 10, 10, 10);
                                }
                                hitSpotX = -1;
                                hitSpotY = -1;
                            } else {
                                killGame = true;
                            }
                        } else {
                            //snake has no tail. Game Over
                            rollCredits();
                        }
                    } else {
                        //regular snake movement
                        if (1 === map[this.X][this.Y]) {
                            this.score += 50;
                            placeFood();
                            this.elements++;
                        }

                        ctx.fillRect(this.X * 10, this.Y * 10, 10 - 1, 10 - 1);
                        ctx.fillStyle = this.color;
                        map[this.X][this.Y] = 2;
                        this.tail.unshift([this.X, this.Y]);

                        this.X += xV[this.direction];
                        this.Y += yV[this.direction];

                        if (this.elements < this.tail.length) {
                            dir = this.tail.pop();
                            map[dir[0]][dir[1]] = 0;
                            ctx.clearRect(dir[0] * 10, dir[1] * 10, 10, 10);
                        }
                    }
                } else if (!turn.length) {
                    if(hitSpotX != -1){
                        hitSpotX = this.X;
                        hitSpotY = this.Y;
                        aggressorLength = this.elements;
                    } else {
                        //seems a head on collision as hitSpot already exists. Kill game
                        rollCredits();
                    }
                }
            }
        };
        snakeCount++;
        return this;
    }

    var snake1 = new Snake();
    var snake2 = new Snake();
    //tracking all snakes created in this array
    var snakes = [snake1, snake2];
    var interval = 0;
    var score = 0;
    var inc_score = 50;
    var sum = 0, easy = true;
    var i, dir;
    var win = window;
    var doc = document;
    var canvas = doc.createElement('canvas');
    var canvas1 = doc.createElement('canvas');
    var setInt = win.setInterval;
    var clInt = win.clearInterval;
    for (i = 0; i < width; i++) {
        map[i] = [];
    }
    // canvas for snake and food
    canvas.setAttribute('width', width * 10);
    canvas.setAttribute('height', height * 10);
    ctx = canvas.getContext('2d');
    doc.body.appendChild(canvas);

    // first canvas for background grid
    canvas1.setAttribute('width', width * 10);
    canvas1.setAttribute('height', height * 10);
    ctx1 = canvas1.getContext('2d');
    doc.body.appendChild(canvas1);

    //vertical lines
    for (var i = 0; i < width; i++) {
        ctx1.beginPath();
        ctx1.moveTo(i * 10, 0);
        ctx1.lineTo(i * 10, height * 10);
        //set line color
        ctx1.strokeStyle = '#8C9191';
        ctx1.stroke();
    }

    //Horizontal lines
    for (var y = 0; y < height; y++) {
        ctx1.beginPath();
        ctx1.moveTo(0, y * 10);
        ctx1.lineTo(width * 10, y * 10);
        ctx1.stroke();
    }

    function placeFood() {
        var x, y;
        do {
            x = MR() * width | 0;
            y = MR() * height | 0;
        } while (map[x][y]);
        map[x][y] = 1;
        ctx.strokeRect(x * 10 + 1, y * 10 + 1, 10 - 2, 10 - 2);
        ctx.strokeStyle = "green";
    }

    placeFood();
    placeFood();

    function rollCredits() {
        var topScore = snake1.score;
        var winner = "Player1"
        for (i = 1; i < snakes.length; i++) {
            var snake = snakes[i];
            if(snake.score > topScore){
                winner = "Player2";
            } else if(snake.score == topScore){
                //more better way to handle tie's would be needed. But for now - no winner
                winner = "players. Its a tie"
            }
        }
        ctx.fillStyle = '#f00';
        ctx.font = 'italic bold 30px sans-serif';
        ctx.textBaseline = 'Middle';
        ctx.fillText('GAME OVER!!!', 220, 100);
        ctx.fillText("All hail the "+winner, 150, 150);
        ctx.fillStyle = 'green';
        ctx.font = ' italic 20px courier';
        ctx.textBaseline = 'Middle';
        ctx.fillText('Hit ENTER to RESTART!!', 15, 350);
        //clear off temp variables
        hitSpotX = -1;
        hitSpotY = -1;
        killGame = false;
    }

    function restart() {
        ctx.clearRect(0, 0, width * 10, height * 10);
        map = [];
        for (i = 0; i < snakes.length; i++) {
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
            for (i = 0; i < snakes.length; i++) {
                var snake = snakes[i];
                snake.X = (snake.X + width) % width;
                snake.Y = (snake.Y + height) % height;
            }
        }
        --inc_score;
        snake1.move();
        snake2.move();
    }

    interval = setInt(clock, 120);

    // Adding keyboard controls
    doc.onkeydown = function (e) {

        var code = e.keyCode - 37;

        /*
         * 0: left
         * 1: up
         * 2: right
         * 3: down
         **/
        //first snake arrow keys
        if (code == 0 && snake1.direction != 2) {
            snake1.direction = 0;
        } else if (code == 1 && snake1.direction != 3) {
            snake1.direction = 1;
        } else if (code == 2 && snake1.direction != 0) {
            snake1.direction = 2;
        } else if (code == 3 && snake1.direction != 1) {
            snake1.direction = 3;
        } else if (e.keyCode == 65 && snake2.direction != 2) { //second snake wasd keys
            snake2.direction = 0;
        } else if (e.keyCode == 87 && snake2.direction != 3) {
            snake2.direction = 1;
        } else if (e.keyCode == 68 && snake2.direction != 0) {
            snake2.direction = 2;
        } else if (e.keyCode == 83 && snake2.direction != 1) {
            snake2.direction = 3;
        } else if (e.keyCode == 13) {
            restart();
        }
    }
}