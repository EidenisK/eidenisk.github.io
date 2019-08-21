/*var time = 4000;
var currentImage = 1;
var maxImages = 6;
var timeoutVar = setTimeout(nextImage, time);

$(document).ready(function() {
	resetTimeout();

	$("#pictures").on("click", function() {
		nextImage();
		return false;
	});
});

function resetTimeout() {
	clearTimeout(timeoutVar);
	timeoutVar = setTimeout(nextImage, time);
}

function nextImage() {
	$("#pictures").animate({
		color: "#000000"
	}, 1000);

	currentImage++;
	if(currentImage > maxImages) currentImage = 1;
	var str = "url(./img/pictures/" + currentImage + ".jpg)";
	$("#pictures").css("background-image", str);
	resetTimeout();


}*/

function showImg(index) {
	$("#img-display").attr("src", "./img/pictures/" + index + ".jpg");
	$("#img-display-container").css("display", "block");
}