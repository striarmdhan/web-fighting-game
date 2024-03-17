optionsButton.addEventListener("click", function () {
    myPopup.classList.add("show");
});
close.addEventListener("click", function () {
    myPopup.classList.remove("show");
});
window.addEventListener("click", function (event) {
    if (event.target == myPopup) {
        myPopup.classList.remove("show");
    }
});