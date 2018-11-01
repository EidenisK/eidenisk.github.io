var storageRef = firebase.storage();
var fileButton = document.querySelector('#fileButton');
var file_status = document.querySelector("#file_status");
var fileName = document.querySelector('#fileNameInput');

//--------------------------------------------
//-----------------UPLOAD---------------------
//--------------------------------------------

fileButton.addEventListener('change', function(e) { uploadFile(e) });

function uploadFile(e) {
  var file = e.target.files[0];
  var fileRef = storageRef.ref("openData/" + file.name);

  var task = fileRef.put(file);
  task.on('state_changed',
    function progress(snapshot) {
      var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      file_status.innerHTML = "Įkeliama: " + percentage + "%";
    },
    function error(err) {
      file_status.innerHTML = "Būsena: KLAIDA - " + err.message;
    },
    function complete() {
      file_status.innerHTML = "Būsena: FAILAS ĮKELTAS";
      if(fileName.value != "")
        updateDatabase(fileRef, fileName.value);
      else updateDatabase(fileRef, file.name);
      loadMessageList();
    }
  );
}

function updateDatabase(fileRef, name) {
  var date = moment().format('YYYY-MM-DD HH:mm:ss');
  var docRef = firestore.doc("openData/" + date);
  fileRef.getDownloadURL().then(function(url) {
    docRef.set( {
      name: name,
      link: "sample",
      downloadURL: url,
      date: date
    }).then(function() {
      file_status.innerHTML = "Būsena: ĮKELTA";
    }).catch(function(error) {
      file_status.innerHTML = "Būsena: KLAIDA - " + error.message;
    });
  });
}

//--------------------------------------------
//-----------------DELETE---------------------
//--------------------------------------------

function delete_files(database_file_id, storage_file_name) {
  if (!firebase.auth().currentUser) return;
  firestore.doc("openData/" + database_file_id).delete();
  storageRef.ref('uploads/' + storage_file_name).delete().then(loadMessageList());
}
