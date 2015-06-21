
function init() {
        var width = 65;
        var height = 40;

        var ctx;
        var turn = [];

        var xV = [-1, 0, 1, 0];
        var yV = [0, -1, 0, 1];
        var queue = [];

        var elements = 1;
        var map = [];
        var MR = Math.random;
        var X = 5 + (MR() * (width - 10)) | 0;
        var Y = 5 + (MR() * (height - 10)) | 0;
        var direction = MR() * 3 | 0;

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

        function restart(){
            ctx.clearRect(0, 0, width * 10, height * 10);
            queue = [];

            elements = 1;
            map = [];

            X = 5 + (MR() * (width - 10)) | 0;
            Y = 5 + (MR() * (height - 10)) | 0;

            direction = MR() * 3 | 0;

            score = 0;
            inc_score = 50;

            for (i = 0; i < width; i++) {
                map[i] = [];
            }

            placeFood();
        }

        function clock() {
            if (easy) {
                X = (X + width) % width;
                Y = (Y + height) % height;
            }
            --inc_score;
            if (turn.length) {
                dir = turn.pop();
                if ((dir % 2) !== (direction % 2)) {
                    direction = dir;
                }
            }
            if ((easy || (0 <= X && 0 <= Y && X < width && Y < height)) && 2 !== map[X][Y]) {
                if (1 === map[X][Y]) {
                    score += Math.max(5, inc_score);
                    inc_score = 50;
                    placeFood();
                    elements++;
                }

                ctx.fillRect(X * 10, Y * 10, 10 - 1, 10 - 1);
                map[X][Y] = 2;
                queue.unshift([X, Y]);

                X += xV[direction];
                Y += yV[direction];

                if (elements < queue.length) {
                    dir = queue.pop()

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
                turn.unshift(code);
            } else if (-5 == code) {
                if (interval) {
                    clInt(interval);
                    interval = 0;
                } else {
                    interval = setInt(clock, 120);
                }
            } else { // O.o
                dir = sum + code;
                if (dir == 44 || dir == 94 || dir == 126 || dir == 171) {
                    sum += code
                } else if (dir === 218) easy = 1;
            }
        }
    }