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
	document.getElementById("siuntiniai_checkbox").checked = false;

  	var child = document.querySelector("#load_messages_list");
  	child.style.paddingRight = child.offsetWidth - child.clientWidth + "px";
})

//---------------------------------------------------
//---------------------- LOGIN ----------------------
//---------------------------------------------------
function tryLogIn(event) {
	var loginPassword = document.getElementById("login_password");
  	var loginStatus = document.querySelector('#login_status');

  	if(event.key == "Enter" && !firebase.auth().currentUser && loginPassword.value != null && loginPassword.value != "") {
    	var pass = loginPassword.value;
	    firebase.auth().signInWithEmailAndPassword('eidenis.gargzdai@gmail.com', pass).then(function() {
	      	//SUCCESSFUL LOGIN

	      	loginStatus.innerHTML = "Būsena: PRISIJUNGTA";
	      	$('#view_row').show();
	      	$('#login_row').hide();
	      	$("#mode_button").show();
	      	loadMessageList();
	    }).catch(function(error) {
			//UNSUCCESSFUL LOGIN

	      	$("#login_password").css("border-bottom", "2px solid red");
	      	console.log(error.message);
    	});
  	}
}

//---------------------------------------------------
//------------ TOGGLE UPLOAD & DOWNLOAD -------------
//---------------------------------------------------
var view_mode = true;

$("#mode_button").click(function(e) {
  	if (!firebase.auth().currentUser) return;

	$("#upload_row").toggle();
	$("#view_row").toggle();
	$("#up_icon").toggle();
	$("#down_icon").toggle();
	$("#load_messages_button").css("background", "white");

	if(!view_mode) loadMessageList();
  	view_mode = !view_mode;
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