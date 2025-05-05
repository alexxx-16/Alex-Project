function buttonFlash(colour){
    $("." + colour).addClass("pressed");
    setTimeout(function(){
        $("." + colour).removeClass("pressed");
    },200);
}

function playSound(colour){
    new Audio("sounds/" +  colour + ".mp3").play();
}

$(".btn").click(function(){
    userPickedColours.push(this.id);
    buttonFlash(this.id);
    playSound(this.id);
    checkAnswer();
})

$('body').keydown(function(){
    if(level === 0){
        $("body").removeClass("game-over");
        nextLevel();
    }
})

var colours = ["green","red","yellow","blue"];
var colourSequence = [];
var userPickedColours = [];
var level = 0;

function nextLevel(){
    userPickedColours = [];
    var randomColour = colours[Math.floor(Math.random() * 4)];
    colourSequence.push(randomColour);
    buttonFlash(randomColour);
    playSound(randomColour);
    $("h1").text("Level " + (level++ + 1));
}

function checkAnswer(){
    var userPickedLast = userPickedColours.length - 1;
    if(userPickedColours[userPickedLast] === colourSequence[userPickedLast]){
        if(userPickedLast === colourSequence.length - 1){
            setTimeout(nextLevel,1000);
        }
    } else {
        gameOver();
    }
}

function gameOver(){
    $("h1").text("Game Over, Press Any Key To Start");
    $("body").addClass("game-over");
    new Audio("sounds/wrong.mp3").play();
    colourSequence = [];
    userPickedColours = [];
    level = 0;
}
