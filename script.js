const exploreBtn = document.querySelector(".explore");

if (exploreBtn) {
  exploreBtn.addEventListener("click", () => {
    alert("Explore More clicked!");
  });
}

const themeBtn = document.getElementById("themeBtn");
if(themeBtn){
  themeBtn.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
});
}

const getstartedbtn = document.querySelector("#getStart");

if (getstartedbtn) {
  getstartedbtn.addEventListener("click", () => {
    alert("Welcome to Digi-Media");
  });
}

const startBtn = document.querySelector(".btn-orange");
if(startBtn){
startBtn.addEventListener("click", function () {
  alert("Welcome to DigiMedia!");
});
}



let date = new Date();
document.getElementById("signUp").innerHTML = date;