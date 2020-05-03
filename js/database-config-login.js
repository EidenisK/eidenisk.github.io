//---------------------------------------------------
//----------------- INITIALIZE ----------------------
//---------------------------------------------------
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
const settings = {timestampsInSnapshots: true};
firestore.settings(settings)

$(document).ready(function() {
	//on document load - set up interface
	firebase.auth().signOut();
	$("#upload_row").hide();

  	var child = document.querySelector("#load_messages_list");
  	child.style.paddingRight = child.offsetWidth - child.clientWidth + "px";
})

//---------------------------------------------------
//---------------------- LOGIN ----------------------
//---------------------------------------------------
const emailField = document.getElementById("login_email");
const passwordField = document.getElementById("login_password");
var userID = "null";

function tryLogIn(event) {
	if(event.key != "Enter" || firebase.auth().currentUser) return;
	if(emailField.value == "" || passwordField.value == "") return;

    firebase.auth().signInWithEmailAndPassword(
    	emailField.value, passwordField.value).then(function() {
      	//SUCCESSFUL LOGIN

      	$('#view_row').show();
      	$('#login_row').hide();
      	$("#mode_button").show();

      	userID = firebase.auth().currentUser.uid;
      	loadMessageList();
    }).catch(function(error) {
		//UNSUCCESSFUL LOGIN

      	$("#login_password").css("border-bottom", "2px solid red");
      	$("#login_email").css("border-bottom", "2px solid red");
      	console.log(error.message);
	});
}

//---------------------------------------------------
//------------ TOGGLE UPLOAD & DOWNLOAD -------------
//---------------------------------------------------
$("#mode_button").click(function(e) {
  	if (!firebase.auth().currentUser) return;

	$("#upload_row").toggle();
	$("#view_row").toggle();
	$("#up_icon").toggle();
	$("#down_icon").toggle();
	$("#load_messages_button").css("background", "white");

	if($("#view_row").is(":visible")) loadMessageList();
});

//---------------------------------------------------
//----------------- OTHER FUNCTIONS -----------------
//---------------------------------------------------

function setBg(bgString) {
	if(bgString == "red") bgString = "#ed9797";
	else if(bgString == "white") bgString = "#ffffff";
	else if(bgString == "green") bgString = "#ccf2bc";
	$("#load_messages_button").css("background", bgString);
}

function showError(textString) {
	console.log(textString);
	setBg("red");
}

function showSuccess(textString) {
	console.log(textString);
	setBg("green");
}