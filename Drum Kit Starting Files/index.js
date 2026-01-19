const drums = document.querySelectorAll(".drum");
// console.log(drums);

for (let i = 0; i < drums.length; i++) {
  drums[i].addEventListener("click", function () {
    // console.log(this.innerHTML);
    playSound(this.innerHTML);
    flashAnimation(this.innerHTML);
  });
}

document.addEventListener("keydown", function (event) {
  // console.log(event.key);
  playSound(event.key.toLowerCase());
  flashAnimation(event.key.toLowerCase());
});

function playSound(drumSelected) {
  switch (drumSelected) {
    case "w":
      new Audio("./sounds/crash.mp3").play();
      break;
    case "a":
      new Audio("./sounds/kick-bass.mp3").play();
      break;
    case "s":
      new Audio("./sounds/snare.mp3").play();
      break;
    case "d":
      new Audio("./sounds/tom-1.mp3").play();
      break;
    case "j":
      new Audio("./sounds/tom-2.mp3").play();
      break;
    case "k":
      new Audio("./sounds/tom-3.mp3").play();
      break;
    case "l":
      new Audio("./sounds/tom-4.mp3").play();
      break;

    default:
      console.log("Key not assigned to a drum");
      break;
  }
}

function flashAnimation(drumSelected) {
  const validKeys = "wasdjkl";
  if (validKeys.includes(drumSelected)) {
    const activeDrum = document.querySelector(`.${drumSelected}`);
    activeDrum.classList.add("pressed");
    setTimeout(() => activeDrum.classList.remove("pressed"), 200);
  }
}
