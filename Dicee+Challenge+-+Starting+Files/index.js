var ranNum1 = Math.ceil(Math.random() * 6);
var ranNum2 = Math.ceil(Math.random() * 6);

var ranImg1 = "./images/dice" + ranNum1 + ".png";
var ranImg2 = "./images/dice" + ranNum2 + ".png";

document.getElementsByClassName("img1")[0].setAttribute("src",ranImg1);
document.getElementsByClassName("img2")[0].setAttribute("src",ranImg2);

if(ranNum1 > ranNum2){
    document.querySelector("h1").textContent = "Player 1 won!";
} else if(ranNum2 > ranNum1){
    document.querySelector("h1").textContent = "Player 2 won!";
} else {
    document.querySelector("h1").textContent = "It's a tie!";
}