const BUTTON_COLOURS = ["green", "red", "yellow", "blue"];
const sounds = {
  green: new Audio("./sounds/green.mp3"),
  red: new Audio("./sounds/red.mp3"),
  yellow: new Audio("./sounds/yellow.mp3"),
  blue: new Audio("./sounds/blue.mp3"),
  wrong: new Audio("./sounds/wrong.mp3"),
};
let gamePattern = [];
let userClickedPattern = [];
let level = 0;
let started = false;
let userCanClick = true;

const gameTitle = $("h1");

function nextSequence() {
  userCanClick = true;
  userClickedPattern = [];
  level++;
  gameTitle.text(`Level ${level}`);

  const randomNumber = Math.floor(Math.random() * 4);
  const randomChosenColour = BUTTON_COLOURS[randomNumber];

  gamePattern.push(randomChosenColour);
  playSound(randomChosenColour);
  $(`#${randomChosenColour}`).fadeOut(100).fadeIn(100);

  console.log(`Game: ${gamePattern}`);
}

$(document).on("keydown", function () {
  if (!started) {
    nextSequence();
    started = true;
  }
});

$(".btn").on("click", function () {
  if (!userCanClick || !started) return;

  const userChosenColour = this.id;
  userClickedPattern.push(userChosenColour);

  playSound(userChosenColour);
  animatePress(userChosenColour);
  console.log(`User: ${userClickedPattern}`);
  checkAnswer(userClickedPattern.length - 1);
});

function playSound(name) {
  const sound = sounds[name];
  if (sound) {
    sound.currentTime = 0;
    sound.play();
  }
}

function animatePress(currentColour) {
  $(`#${currentColour}`).addClass("pressed");

  setTimeout(() => {
    $(`#${currentColour}`).removeClass("pressed");
  }, 100);
}

function checkAnswer(currentLevel) {
  if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      userCanClick = false;

      setTimeout(() => {
        nextSequence();
      }, 1000);
    }
  } else {
    playSound("wrong");
    gameTitle.text("Game over, Press any key to Restart.");
    $("body").addClass("game-over");

    setTimeout(() => {
      $("body").removeClass("game-over");
    }, 200);

    startOver();
  }
}

function startOver() {
  gamePattern = [];
  level = 0;
  started = false;
}
