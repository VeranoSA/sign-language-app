var updateProgressBar = function (progressBar, value) {
    value = Math.round(value);
    progressBar.querySelector(".progress__fill").style.width = `${value}`;
    progressBar.querySelector(".progress__text").textContent = `${value}`;
}