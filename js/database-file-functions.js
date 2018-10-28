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
      var docRef = firestore.doc("stored_files/" + date);
      docRef.set( {
        name: file.name,
        date: date
      }).then(function() {
        file_status.innerHTML = "Būsena: ĮKELTA";
      }).catch(function(error) {
        file_status.innerHTML = "Būsena: KLAIDA - " + error.message;
      });
    }
  );
});

const load_files_button = document.querySelector('#load_files_button');
const load_files_list = document.querySelector('#load_files_list');

load_files_button.addEventListener("click", function() {
  firestore.collection('stored_files').get().then(function(snap) {
    var idx = 0;
    load_files_list.innerHTML = "";
    snap.forEach(function(doc) {
      if(doc.data().name != "sample") {
        storageRef.ref('uploads/' + doc.data().name).getDownloadURL().then(function (url) {
          var text = "<li><b>" + idx + ". " + doc.data().name + '</b><br>' + doc.data().date + '<br><u onclick="delete_files(' + "'" + doc.id + "','" + doc.data().name + "'" + ')">IŠTRINTI</u>, <a href="' + url + '">SIŲSTIS</a>' + "</li>"
          load_files_list.innerHTML += text;
        })
      }
      idx++;
    })
  });
});

function delete_files(database_file_id, storage_file_name) {
  firestore.doc("stored_files/" + database_file_id).delete();
  var fileRef = storageRef.ref('uploads/' + storage_file_name);

  fileRef.delete().then(function() {
    load_files_button.click();
  })
}

function download_files(storage_file_name) {

}
