//---------------------------------------------------------
//----------------- UPLOAD MESSAGES -----------------------
//---------------------------------------------------------

const inputText = document.querySelector("#send_text_input");
const linkText = document.querySelector('#send_link_input');

function trySendText(event) {
  if(event.keyCode == 13 && firebase.auth().currentUser)
    uploadMessage();
}

function uploadMessage() {
  if (!firebase.auth().currentUser) {
  	showError("NEPRISIJUNGTA");
    return;
  }

  setBg("white");
  var date = moment().format('YYYY-MM-DD HH:mm:ss');
  var docRef = firestore.doc("openData/" + date);

  docRef.set({
  	tipas: "tekstas",
  	nuoroda: (linkText.value == "" || linkText.value == "nuoroda" ? "null" : linkText.value),
  	pavadinimas: inputText.value
  }).then(function() {
    showSuccess("DONE");
  }).catch(function(error) {
  	showError(error.message);
  });
}

//-----------------------------------------------------
//-----------------UPLOAD FLES ------------------------
//-----------------------------------------------------

var storageRef = firebase.storage();
const publicCheckbox = document.getElementById("siuntiniai_checkbox");

document.querySelector('#file_button').addEventListener('change', function(e) { uploadFile(e) });
function uploadFile(e) {
  var file = e.target.files[0];
  var date = moment().format('YYYY-MM-DD HH:mm:ss');
  var fileRef = storageRef.ref( (publicCheckbox.checked ? "siuntiniai/": "openData/") + date);
  setBg("white");

  var task = fileRef.put(file);
  task.on('state_changed',
    function progress(snapshot) {
      var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setBg("linear-gradient(white, white " + (100 - percentage - 10) + "%, #b4fcb0 " + (100-percentage) + "%)");
    },
    function error(err) {
    	showError(err.message);
    },
    function complete() {
		showSuccess("DONE upload");
  		updateDatabase(fileRef, file.name, inputText.value, date);
      	loadMessageList();
    }
  );
}

function updateDatabase(fileRef, filename, name, date) {
  var docRef = firestore.doc( (publicCheckbox.checked ? "siuntiniai/" : "openData/") + date);

  fileRef.getDownloadURL().then(function(url) {
    docRef.set( {
		tipas: "dokumentas",
  		nuoroda: url,
  		pavadinimas: (name == "" || name == "pavadinimas / tekstas" ? filename : name)
    }).then(function() {
    	showSuccess("DONE update");
    	setBg("white");
    }).catch(function(error) {
    	showError(error.message);
    });
  });
}

//--------------------------------------------
//-----------------DELETE---------------------
//--------------------------------------------

function delete_entry(document_id, is_public) {
	if (!firebase.auth().currentUser) return;
	firestore.doc( (is_public ? "siuntiniai/" : "openData/") + document_id).get().then(function(doc) {
		if(doc.data().tipas == "dokumentas")
			storageRef.ref((is_public ? "siuntiniai/" : 'openData/') + document_id).delete();
		firestore.doc( (is_public ? "siuntiniai/" : "openData/") + document_id).delete();
		loadMessageList();
	});
}