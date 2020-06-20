// Initialize Firebase
var config = {
  apiKey: "AIzaSyAMNdtWVeedQ0-NOBTDPZpxVZcpxMcTnFE",
  authDomain: "eidenisk-data-collection.firebaseapp.com",
  databaseURL: "https://eidenisk-data-collection.firebaseio.com",
  projectId: "eidenisk-data-collection",
  storageBucket: "eidenisk-data-collection.appspot.com",
  messagingSenderId: "295312564384"
};
firebase.initializeApp(config);

const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
firestore.settings(settings)

const siuntiniaiList = document.getElementById("siuntiniaiList");

var rodytiSiuntinius = false;

$(document).ready(function() {
	firestore.collection('LIMROM1z1TVnRoLJs9Kp6JMOn8a2').get().then(function(snap) {
	    snap.forEach(function(doc) {
			var data = doc.id;
		    var pavadinimas = doc.data().pavadinimas;
		    var nuoroda = doc.data().nuoroda;

		    var text = "<li>" + '<a href="' + nuoroda + '">' + pavadinimas + "</a>";
	      	text += '<div class="siuntiniaiDate">' + data.substring(0, 10) + '</div></li>';

     	 	siuntiniaiList.innerHTML = text + siuntiniaiList.innerHTML;
	      	document.getElementById("siuntiniai").style.display = "block";
	      	rodytiSiuntinius = true;
	  });
  });
});

//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------

function switchTab(number)
{
	if( number == 0 && $("#portfolio").is(":visible") ||
		number == 1 && $("#about").is(":visible") ||
		number == 2 && $("#skills").is(":visible"))
		return;

	$("#portfolio").fadeOut();
	$("#about").fadeOut();
	$("#skills").fadeOut();

	document.getElementById("tab-portfolio").classList.remove("tab-selected");
	document.getElementById("tab-about").classList.remove("tab-selected");
	document.getElementById("tab-skills").classList.remove("tab-selected");

	if(number == 0) {
		$("#portfolio").delay(350).fadeIn(400);
		document.getElementById("tab-portfolio").classList.add("tab-selected");
	} else if (number == 1) {
		$("#about").delay(350).fadeIn(400);
		document.getElementById("tab-about").classList.add("tab-selected");
	} else if(number == 2) {
		$("#skills").delay(350).fadeIn(400);
		document.getElementById("tab-skills").classList.add("tab-selected");
	}
}

//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------

//------------ setup ------------------
var canvas = document.getElementById("canvas")
var context = canvas.getContext("2d");
var mouseEventDiv = document.getElementById("mouse-event-div");

var canvasWidth = $(window).width();
var canvasHeight = $("#PICTURE-BACKGROUND").position().top +1;

$("#canvas").attr("width", canvasWidth);
$("#canvas").attr("height", canvasHeight);

var mouseX = 0;
var mouseY = 0;
var mouseStillTime = 0;
var isMouseInside = false;

var hasMouse = false;
//-------------------------------------

//------------- record mouse position ----------------------
mouseEventDiv.addEventListener('mousemove', function(evt) {
	var rect = canvas.getBoundingClientRect();
	mouseX = evt.clientX - rect.left;
	mouseY = evt.clientY - rect.top;
}, false);
mouseEventDiv.addEventListener('mouseover', function(evt){
	hasMouse = true;
	isMouseInside = true;
}, false);
mouseEventDiv.addEventListener('mouseout', function(evt){
	isMouseInside = false;
}, false);
//----------------------------------------------------------

var motionTrailLength = 20;
var objects = [];

//-------------- generate or draw trail objects --------------
function drawTrailObject(x1, y1, x2, y2, x3, y3, opacity) {
	context.beginPath();
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.lineTo(x3, y3);
	context.closePath();

	context.lineWidth = 1;
	context.strokeStyle = "rgba(255,255,255," + opacity + ")";
	context.stroke();
}

function getRandomFloat(min, max) {
	return Math.random() * (max - min) + min;
}

function generateRandomTrailObject(xPos, yPos, opacity) {
	var maxDistanceToCursor = Math.min($(window).width() / 2, 100 + mouseStillTime * 1);
	var maxDistanceToEdges = 50;
	var minDistanceToEdges = 20;

	var x1 = getRandomFloat(xPos - maxDistanceToCursor, xPos + maxDistanceToCursor);
	var y1 = getRandomFloat(yPos - maxDistanceToCursor, yPos + maxDistanceToCursor);
	
	var x2 = getRandomFloat(x1 - maxDistanceToEdges, x1 + maxDistanceToEdges);
	var y2 = getRandomFloat(y1 - maxDistanceToEdges, y1 + maxDistanceToEdges);

	var x3 = getRandomFloat(x1 - maxDistanceToEdges, x1 + maxDistanceToEdges);
	var y3 = getRandomFloat(y1 - maxDistanceToEdges, y1 + maxDistanceToEdges);

	while(Math.abs(x3 - x2) > maxDistanceToEdges)
		x3 = getRandomFloat(x1 - maxDistanceToEdges, x1 + maxDistanceToEdges);
	while(Math.abs(y3 - y2) > maxDistanceToEdges)
		y3 = getRandomFloat(y1 - maxDistanceToEdges, y1 + maxDistanceToEdges);

	objects.push({
		x1: x1,
	 	x2: x2,
	 	x3: x3,
	 	y1: y1,
	 	y2: y2,
	 	y3: y3
	});
}
//----------------------------------------------------------

//------------------- main animation loop -------------------------
var frameCount = 0;
var frameRate = 5.0;

var lastMouseX = 0;
var lastMouseY = 0;

function updateForDesktop() {
	//------- setup for frame drawing ----------
	frameCount++;
	if(frameCount != frameRate) {
		requestAnimationFrame(updateForDesktop);
		return;
	} else frameCount = 0;
	context.clearRect(0,0,canvas.width,canvas.height);

	//---------- draw previous objects ---------
	for(var i = 0; i < objects.length; i++) {
		drawTrailObject(objects[i].x1, objects[i].y1, 
						objects[i].x2, objects[i].y2,
						objects[i].x3, objects[i].y3,
						(i+1) / (2*objects.length));
	}

	//--------- draw current object ------------
	if(isMouseInside) {
		generateRandomTrailObject(mouseX, mouseY, 0.5);
	}
	removeLast();

	//---------- update scattering --------------
	if(mouseX == lastMouseX && mouseY == lastMouseY)
		mouseStillTime++;
	else mouseStillTime = 0;

	lastMouseX = mouseX;
	lastMouseY = mouseY;
	
	//----------- next frame --------------------
	requestAnimationFrame(updateForDesktop);
}

function removeLast() {
	if(objects.length > motionTrailLength || (!isMouseInside && hasMouse) )
		objects.shift();
}
//----------------------------------------------------------


//----------------- draw random triangles -------------------
function updateForMobile() {
	//------- setup for frame drawing ----------
	frameCount ++;
	if(frameCount != frameRate) {
		requestAnimationFrame(updateForMobile);
		return;
	} else frameCount = 0;
	context.clearRect(0,0,canvas.width,canvas.height);

	//---------- draw previous objects ---------
	for(var i = 0; i < objects.length; i++) {
		drawTrailObject(objects[i].x1, objects[i].y1, 
						objects[i].x2, objects[i].y2,
						objects[i].x3, objects[i].y3,
						(i+1) / (2*objects.length));
	}

	//--------- draw current object ------------
	generateRandomTrailObject(getRandomFloat(0, canvasWidth), getRandomFloat(0, canvasHeight), 0.5);
	removeLast();
	
	//----------- next frame --------------------
	requestAnimationFrame( (hasMouse ? updateForDesktop : updateForMobile) );
}
//----------------------------------------------------------
updateForMobile();

//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------