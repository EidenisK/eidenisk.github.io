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

$(document).ready(function() {
	firestore.collection('siuntiniai').get().then(function(snap) {
	    snap.forEach(function(doc) {
			var data = doc.id;
		    var pavadinimas = doc.data().pavadinimas;
		    var nuoroda = doc.data().nuoroda;

		    var text = "<li>" + '<a href="' + nuoroda + '">' + pavadinimas + "</a>";
	      	text += ' <div class="siuntiniaiDate">(' + data.substring(0, 10) + ')</div>';
	      	text += "</li>"

     	 	siuntiniaiList.innerHTML = text + siuntiniaiList.innerHTML;
	      	document.getElementById("siuntiniai").style.display = "block";
	  });
  });
});