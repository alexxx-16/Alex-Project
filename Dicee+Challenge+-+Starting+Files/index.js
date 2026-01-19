function diceGame() {
  const dice1Number = Math.floor(Math.random() * 6 + 1);
  const dice2Number = Math.floor(Math.random() * 6 + 1);

  document
    .querySelector(".img1")
    .setAttribute("src", `./images/dice${dice1Number}.png`);
  document
    .querySelector(".img2")
    .setAttribute("src", `./images/dice${dice2Number}.png`);

  const message = document.querySelector("h1");

  dice1Number > dice2Number
    ? (message.textContent = "🚩 Player One Wins!")
    : dice2Number > dice1Number
      ? (message.textContent = "Player Two Wins! 🚩")
      : (message.textContent = "It's a Draw");
}

diceGame();
