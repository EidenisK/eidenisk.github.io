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

firebase.auth().signOut();
$("#upload_row").hide();

//--------------------------------------------
//-----------------LOGIN----------------------
//--------------------------------------------

/*var loginButton = document.querySelector('#login_button');
var loginPassword = document.querySelector('#login_password');
var loginStatus = document.querySelector('#login_status');

loginButton.addEventListener("click", function(e) {
  var pass = loginPassword.value;
  firebase.auth().signInWithEmailAndPassword('eidenis.gargzdai@gmail.com', pass).then(function() {
    loginStatus.innerHTML = "Būsena: PRISIJUNGTA";
    $('#upload_row').show();
    $('#login_row').hide();
  }).catch(function(error) {
    loginStatus.innerHTML = "Būsena: KLAIDA - " + error.message;
  });
});*/
