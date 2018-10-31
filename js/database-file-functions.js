var fileButton = document.querySelector('#fileButton');
var storageRef = firebase.storage();

fileButton.addEventListener('change', function(e) {
  var file_status = document.getElementById("file_status");

  //CHECK LOGIN
  var user = firebase.auth().currentUser;

  if (!user) {
    // User is not signed in.
    file_status.innerHTML = "Būsena: KLAIDA - NEPRISIJUNGTA";
    return;
  }


  //get files
  var file = e.target.files[0];
  //create storage ref
  var fileRef = storageRef.ref('uploads/' + file.name);
  //upload
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

      //put uploaded file data to the database
      var date = moment().format('YYYY-MM-DD HH:mm:ss');
      var docRef = firestore.doc("openData/" + date);
      fileRef.getDownloadURL().then(function(url) {
        docRef.set( {
          name: file.name,
          downloadURL: url,
          date: date
        }).then(function() {
          file_status.innerHTML = "Būsena: ĮKELTA";
        }).catch(function(error) {
          file_status.innerHTML = "Būsena: KLAIDA - " + error.message;
        });
      });
    }
  );
});

function delete_files(database_file_id, storage_file_name) {
  firestore.doc("openData/" + database_file_id).delete();
  var fileRef = storageRef.ref('uploads/' + storage_file_name);

  fileRef.delete().then(function() {
    load_files_button.click();
  })
}

function download_files(storage_file_name) {

}
