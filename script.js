var modal = $('#resultModal');
var difficulty = 1;
if(difficulty == 0){
    var timeLimitInSeconds = 60;
    var p = 10;
    var q = 10;
    var scale = 25;
} else if (difficulty == 1){
    var timeLimitInSeconds = 30;
    var p = 12;
    var q = 12;
    var scale = 21;
} 

$('#timeLimit').text(timeLimitInSeconds);
loseModal = function() {
    modal.css("display", "block");
    $(".gamehead").text("Game Over");
    $(".gameMessage").text(timeLimitInSeconds +" seconds is up, You Lose!");
    $("#restart").text("Reset");
}

winModal = function() {
    modal.css("display", "block");
    $(".gamehead").text("Congratulations, You Win!");
    $(".gameMessage").text("You completed the maze under "+ timeLimitInSeconds +" seconds!");
    $("#restart").text("Next Level");
}

$("#restart").click(()=>{
    document.location.reload();
});

$("#skipLvl").click(()=>{
    document.location.reload();
});


function startTimer(timeLimit) {
    var startingTime = Date.now();
    var timeDiff;
    setInterval(()=>{
        if(inGame) {
            timeDiff = timeLimitInSeconds - (((Date.now() - startingTime) / 1000)|0);
            $('#timeBadge').text("You have " + timeDiff + " seconds left");
            if (timeDiff <= 0) {
                $('#timeBadge').text("Game Over");
                inGame = false;
                loseModal();
            }
        }
    });
}

window.onload = function () {
    startTimer(timeLimitInSeconds);
}

inGame = true
window.addEventListener('keydown',doKeyDown,true);

function doKeyDown(evt)
{
    if (inGame) {
        switch (evt.keyCode) {
            case 38:  /* Up arrow*/
                m.moveUp("canvas");
                break;
            case 87:  /* Up arrow*/
                m.moveUp("canvas");
                break;
            case 40 :  /* Down arrow*/
                m.moveDown("canvas");
                break;
            case 83 :  /* Down arrow*/
                m.moveDown("canvas");
                break;
            case 37:  /* Left arrow*/
                m.moveLeft("canvas");
                break;
            case 65:  /* Left arrow*/
                m.moveLeft("canvas");
                break;
            case 39:  /* Right arrow*/
                m.moveRight("canvas");
                break;
            case 68:  /* Right arrow*/
                m.moveRight("canvas");
                break;
        }
        if (m.checkWin("canvas"))
            inGame = false;
    }
}


var dsd = function (size) {
    this.N = size; //N = 100 
    this.P = new Array(this.N);
    this.R = new Array(this.N);

    this.init = function () {
        for (var i = 0; i < this.N; i++) {
            this.P[i] = i;
            this.R[i] = 0;
        }
    }

    this.union = function (x, y) {
        var u = this.find(x);
        var v = this.find(y);
        if (this.R[u] > this.R[v]) {
            this.R[u] = this.R[v] + 1;
            this.P[u] = v;
        }
        else {
            this.R[v] = this.R[u] + 1;
            this.P[v] = u;
        }
    }

    this.find = function (x) {
        if (x == this.P[x])
            return x;
        this.P[x] = this.find(this.P[x]);
        return this.P[x];
    }
};

function random(min, max) { 
    return min + (Math.random() * (max - min));            
}
function randomChoice(choices) { 
    return choices[Math.round(random(0, choices.length-1))]; 
}

var maze = function (X, Y) {
    this.N = X;
    this.M = Y;
    this.S = scale;
    this.Board = new Array(2 * this.N + 1);
    this.EL = new Array();
    this.vis = new Array(2 * this.N + 1);
    this.delay = 2;
    this.x = 1;
    this.init = function () {
        for (var i = 0; i < 2 * this.N + 1; i++) {
            this.Board[i] = new Array(2 * this.M + 1);
            this.vis[i] = new Array(2 * this.M + 1);
        }

        for (var i = 0; i < 2 * this.N + 1; i++) {
            for (var j = 0; j < 2 * this.M + 1; j++) {
                if (!(i % 2) && !(j % 2)) {
                    this.Board[i][j] = '+';
                }
                else if (!(i % 2)) {
                    this.Board[i][j] = '-';
                }
                else if (!(j % 2)) {
                    this.Board[i][j] = '|';
                }
                else {
                    this.Board[i][j] = ' ';
                }
                this.vis[i][j] = 0;
            }
        }
    }


    this.addEdges = function () {
        for (var i = 0; i < this.N; i++) {
            for (var j = 0; j < this.M; j++) {
                if (i != this.N - 1) {
                    this.EL.push([[i, j], [i + 1, j], 0]);
                }
                if (j != this.M - 1) {
                    this.EL.push([[i, j], [i, j + 1], 0]);
                }
            }
        }
    }


    this.h = function (e) {
        return e[1] * this.M + e[0];
    }
    this.randomize = function (EL) {
        for (var i = 0; i < EL.length; i++) {
            var si = Math.floor(Math.random() * 387) % EL.length;
            var tmp = EL[si];
            EL[si] = EL[i];
            EL[i] = tmp;
        }
        return EL;
    }

    this.breakDownWall = function (cord) {
        var x = cord[0][0] + cord[1][0] + 1;
        var y = cord[0][1] + cord[1][1] + 1;
        this.Board[x][y] = ' ';
    }

    this.generateMaze = function () {
        this.EL = this.randomize(this.EL);
        var D = new dsd(this.M * this.M);
        D.init();
        var s = this.h([0, 0]);
        var e = this.h([this.N - 1, this.M - 1]);
        this.Board[1][0] = ' ';
        this.Board[2 * this.N - 1][2 * this.M] = ' ';
        //Kruskal's Algorithm
        for (var i = 0; i < this.EL.length; i++) {
            var x = this.h(this.EL[i][0]);
            var y = this.h(this.EL[i][1]);
            if (D.find(s) == D.find(e)) {
                if (!(D.find(x) == D.find(s) && D.find(y) == D.find(s))) {
                    if (D.find(x) != D.find(y)) {
                        D.union(x, y);
                        this.breakDownWall(this.EL[i]);
                        this.EL[i][2] = 0;
                    }
                }
            }

            else if (D.find(x) != D.find(y)) {
                D.union(x, y);
                this.breakDownWall(this.EL[i]);
                this.EL[i][2] = 0;
            }
            else {
                continue;
            }
        }

    };


    this.draw = function (id) {
        this.canvas = document.getElementById(id);
        var scale = this.S;
        temp = [];
        if (this.canvas.getContext) {
            this.ctx = this.canvas.getContext('2d');
            this.Board[1][0] = '$'
            for (var i = 0; i < 2 * this.N + 1; i++) {
                for (var j = 0; j < 2 * this.M + 1; j++) {
                    if (this.Board[i][j] != ' '){
                        this.ctx.fillStyle = "#3d4a59"; //walls
                        this.ctx.fillRect(scale * i, scale * j, scale, scale);
                    }
                    else if(i<5 && j <5)
                        temp.push([i,j])
                    }
            }
            x = randomChoice(temp)
            this.Board[x[0]][x[1]] = 'playerPosition';
            this.ctx.fillStyle = "#bd543c"; //player
            this.ctx.fillRect(scale* x[0], scale * x[1], scale, scale);
        }
    };

    this.checkPos = function (id) {
        for (var i = 0; i < 2 * this.N + 1; i++) {
            for (var j = 0; j < 2 * this.M + 1; j++) {
                if (this.Board[i][j] == 'playerPosition') {
                    return [i,j]
                }
            }
        }
    }

    this.clearMove = function (a,b) {
        var scale = this.S;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.fillStyle = "#a3a2b0"; //available squares
        this.ctx.fillRect(scale * a, scale * b, scale, scale);
        this.Board[a][b] = ' ';//now the square becomes available again
    }

    this.move =  function (a,b) {
        var scale = this.S;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.fillStyle = "#bd543c"; //player
        this.ctx.fillRect(scale * a, scale * b, scale, scale);
        this.Board[a][b] = 'playerPosition';
    }

    this.moveRight = function (id) {
        coordinates = this.checkPos(id);
        var scale = this.S;
        i = coordinates[0];
        j = coordinates[1];
        i++;
        if(i<0){ //if at the edge of the board, do nothing
            return;
        }
        else if(i>2*this.N){
            return;
        }
        else if(this.Board[i][j] ==' ') { //else, if the square is clear, we move
            this.clearMove(i-1,j);
            this.move(i,j);
        }
        else{ //blocked by obstacle, do nothing
            return;
        }
    }

    this.moveLeft = function (id) {
        coordinates = this.checkPos(id);
        var scale = this.S;
        i = coordinates[0];
        j = coordinates[1];
        i--;
        if(i<0){ //if at the edge of the board, do nothing
            return;
        }
        else if(i>2*this.N){
            return;
        }
        else if(this.Board[i][j] ==' ') { //else, if the square is clear, we move
            this.clearMove(i+1,j);
            this.move(i,j); 
        }
        else{ //blocked by obstacle, do nothing
            return;
        }
    }

    
    this.moveUp = function (id) {
        coordinates = this.checkPos(id);
        var scale = this.S;
        i = coordinates[0];
        j = coordinates[1];
        j--;
        if (j < 0){ //if at the edge of the board, do nothing
            return;
        }
        else if (j > 2 * this.M){ 
            return;
        }
        else if (this.Board[i][j] == ' ') {//else, if the square is clear, we move
            this.clearMove(i,j+1);
            this.move(i,j);
        }
        else{//blocked by obstacle, do nothing
            return;
        }
    }

    this.moveDown = function (id) {
        coordinates = this.checkPos(id);
        var scale = this.S;
        i = coordinates[0];
        j = coordinates[1];
        j++;
        if(j<0){ //if at the edge of the board, do nothing
            return;
        }
        else if(j>2*this.M){
            return;
        }
        else if(this.Board[i][j] ==' ') { //else, if the square is clear, we move
            this.clearMove(i,j-1);
            this.move(i,j);
        }
        else{ //blocked by obstacle, do nothing
            return;
        }
    }

    this.checkWin = function (id) {
        coordinates = this.checkPos(id);
        i = coordinates[0];
        j = coordinates[1];
        if (i == p*2-1 && j== q*2) {
            winModal();
            return 1;
        }
        return 0;
    }

};

m = new maze(p , q);
m.init();
m.addEdges();
m.generateMaze();
m.draw("canvas");
