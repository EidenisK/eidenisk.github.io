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
	    if(doc.data().name != "sample") {
	      var link = doc.data().link, name = doc.data().name, date = doc.data().date, url = doc.data().downloadURL, id = doc.id;

	      var text = "<li>" + '<a href="' + url + '">' + name + "</a>";
	      text += ' <div class="siuntiniaiDate">(' + date.substring(0, 10) + ')</div>';
	      text += "</li>"

	      siuntiniaiList.innerHTML = text + siuntiniaiList.innerHTML;
	      document.getElementById("siuntiniai").style.display = "block";
	    }
	  });
  });
});