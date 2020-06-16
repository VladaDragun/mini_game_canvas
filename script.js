"use strict";

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var x = canvas.width/2;
var y = canvas.height-30;
var dx = 4;
var dy = -4;

var ballRadius = 10;
var ballColor = '#0095DD';

var paddleHeight = 10;
var paddleWidth = 85;
var paddleX = (canvas.width-paddleWidth)/2;

var rightPressed = false;
var leftPressed = false;

var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var howMuchColumn = canvas.width;
var howMuchRow = canvas.height;

var brickRowCount = Math.floor((canvas.height/2) / (brickHeight+brickPadding));
var brickColumnCount = Math.floor(canvas.width / (brickWidth+brickPadding))-1;
var bricksCounter = brickRowCount * brickColumnCount;

var bricks = [];

for(var c=0; c<brickColumnCount; c++) {
  bricks[c] = [];
  for(var r=0; r<brickRowCount; r++) {
    bricks[c][r] = {x:0, y:0, status: 1};
  }
}

var score = 0;
var lives = 5;
var allLives = 5;

var scoreTime = document.getElementById('scoreTime');
var scoreCount = document.getElementById('score');
var livesCounter = document.getElementById('livesCounter');
var overlayInfo = document.getElementById('overlayInfo');
var winner = document.getElementById('winner');
var okButton = document.getElementById('okButton');
var reloadButton = document.getElementById('reloadButton');
var newAttempt = document.getElementById('newAttempt');
var tryAgain = document.getElementById('tryAgain');

var backSound = new Audio();
backSound.src = "audio/background.mp3";
backSound.loop = true;
var loseSound = new Audio();
loseSound.src = "audio/lose_sound.mp3";
var winSound = new Audio();
winSound.src = "audio/win_sound.mp3";
var volume = document.getElementById('volume');

volume.onclick = function() {
  if(backSound.muted === true) {
    volume.innerHTML = '<i class="fas fa-volume-up"></i>';
    backSound.muted = false;
  }
  else {
    volume.innerHTML = '<i class="fas fa-volume-mute"></i>';
    backSound.muted = true;
  }
}

var isPaused = false;
var pause = document.getElementById('pause');
pause.onclick = function() {
  if(isPaused) {
    isPaused = !isPaused;
    pause.innerHTML = '<i class="fas fa-pause"></i>';
    backSound.pause();
  }
  else {
    isPaused = !isPaused;
    pause.innerHTML = '<i class="fas fa-play"></i>';
    backSound.play();
  }
};

var ajaxHandlerScript="https://fe.it-academy.by/AjaxStringStorage2.php";
var messages;
var updatePassword;
var stringName='DRAGUN_VLADA_CANVAS_GAME_TEST_INFO';

initApp();

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);
window.addEventListener('beforeunload', function(e) {
  e.preventDefault();
});
window.addEventListener('resize', initApp);

function initApp() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.requestAnimFrame = (function() {
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

function mouseMoveHandler(e) {
  if(isPaused) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
      paddleX = relativeX - paddleWidth;
    }
    if(paddleX < 0) {
      paddleX = 0;
    }
  }

}

function keyDownHandler(e) {

  if(isPaused) {
    if(e.key == 'Right' || e.key == 'ArrowRight') {
      rightPressed = true;
    }
    else if(e.key == 'Left' || e.key == 'ArrowLeft') {
      leftPressed = true;
    }
  }

}

function keyUpHandler(e) {

  if(e.keyCode == 32) {
    isPaused = true;
    overlayInfo.classList.remove('visible');
    overlayInfo.classList.add('invisible');
    backSound.play();
  }

  if(isPaused) {
    if(e.key == 'Right' || e.key == 'ArrowRight') {
      rightPressed = false;
    }
    else if(e.key == 'Left' || e.key == 'ArrowLeft') {
      leftPressed = false;
    }
  }

}

function youWin() {
  isPaused = false;
  winner.classList.remove('invisible');
  winner.classList.add('visible');
  backSound.pause();
  winSound.play();
  reloadButton.onclick = function() {
    document.location.reload();
  }
}

function youLost() {
  isPaused = false;
  newAttempt.classList.remove('invisible');
  newAttempt.classList.add('visible');
  backSound.pause();
  loseSound.play();
  tryAgain.onclick = function() {
    document.location.reload();
  }
}

function collisionDetection() {

  for(var c=0; c<brickColumnCount; c++) {
    for(var r=0; r<brickRowCount; r++) {
      var b = bricks[c][r];
      if(b.status == 1) {
        if(x + dx > b.x && x + dx < b.x + brickWidth && y + dy > b.y && y + dy < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;
          if(score === 5) {
            youWin();
          }
        }
      }
    }
  }

}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = ballColor;
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#1d368a";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {

    for(var c=0; c<brickColumnCount; c++) {
      for(var r=0; r<brickRowCount; r++) {
        if(bricks[c][r].status == 1) {
          var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
          var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = '#1d368a';
          ctx.fill();
          ctx.closePath();
        }
      }
    }

}

function draw() {

    scoreCount.innerHTML = "Счет: " + score + "/" + bricksCounter;
    livesCounter.innerHTML = "Жизни: " + lives + "/" + allLives;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();

if(isPaused) {
    collisionDetection();

    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
      dx = -dx;
      ballColor = '#' + (Math.random() * Math.pow(256, 3) | 0).toString(16).padStart(6, '0');
    }

    if(y + dy < ballRadius) {
      dy = -dy;
      ballColor = '#' + (Math.random() * Math.pow(256, 3) | 0).toString(16).padStart(6, '0');
    }
    else if(y + dy > canvas.height - ballRadius) {
      if(x + ballRadius > paddleX && x < paddleX + paddleWidth) {
        dy = -dy;
        ballColor = '#' + (Math.random() * Math.pow(256, 3) | 0).toString(16).padStart(6, '0');
      }
      else {
        lives--;
        if(!lives) {
          youLost();
        }
        else {
          x = canvas.width/2;
          y = canvas.height-30;
          dx = 4;
          dy = -4;
          paddleX = (canvas.width-paddleWidth)/2;
        }
      }

    }

    x += dx;
    y += dy;

    if(rightPressed) {
      paddleX += 10;
      if(paddleX + paddleWidth > canvas.width) {
        paddleX = canvas.width - paddleWidth;
      }
    }
    else if(leftPressed) {
      paddleX -= 10;
      if(paddleX < 0) {
        paddleX = 0;
      }
    }
}

  requestAnimFrame(draw);

}

draw();

function showMessages() {
    var str='';
    for ( var m=0; m<messages.length; m++ ) {
        var message=messages[m];
        str+="<tr>" + "<td>" +escapeHTML(message.name) + "</td>" + "</tr>";
    }
    document.getElementById('allWinners').innerHTML=str;
    document.getElementById('listOfWinners').classList.remove('invisible');
    document.getElementById('listOfWinners').classList.add('visible');
}

function escapeHTML(text) {
    if ( !text )
        return text;
    text=text.toString()
        .split("&").join("&amp;")
        .split("<").join("&lt;")
        .split(">").join("&gt;")
        .split('"').join("&quot;")
        .split("'").join("&#039;");
    return text;
}

function sendMessage() {
    updatePassword=Math.random();
    $.ajax( {
            url : ajaxHandlerScript,
            type : 'POST', dataType:'json',
            data : { f : 'LOCKGET', n : stringName,
                p : updatePassword },
            cache : false,
            success : lockGetReady,
            error : errorHandler
        }
    );
    document.getElementById('enterWinnerName').classList.remove('visible');
    document.getElementById('enterWinnerName').classList.add('invisible');
}

function lockGetReady(callresult) {
    if ( callresult.error!=undefined )
        alert(callresult.error);
    else {
        messages=[];
        if ( callresult.result!="" ) {
            messages=JSON.parse(callresult.result);
            if ( !Array.isArray(messages) )
                messages=[];
        }

        var senderName=document.getElementById('winnerName').value;
        var message=document.getElementById('allWinners').value;
        messages.push( { name:senderName } );
        if ( messages.length>10 )
            messages=messages.slice(messages.length-10);

        showMessages();

        $.ajax( {
                url : ajaxHandlerScript,
                type : 'POST', dataType:'json',
                data : { f : 'UPDATE', n : stringName,
                    v : JSON.stringify(messages), p : updatePassword },
                cache : false,
                success : updateReady,
                error : errorHandler
            }
        );
    }
}

function updateReady(callresult) {
    if ( callresult.error!=undefined )
        alert(callresult.error);
}

function errorHandler(jqXHR,statusStr,errorStr) {
    alert(statusStr+' '+errorStr);
}

canvas.addEventListener('touchstart', function(event) {
if (event.targetTouches.length == 1) {
var myclick=event.targetTouches[0];
isPaused = true;
overlayInfo.classList.remove('visible');
overlayInfo.classList.add('invisible');
backSound.play();
}
}, false);
