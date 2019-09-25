var storageRef = firebase.storage();
var fileButton = document.querySelector('#fileButton');
var file_status = document.querySelector("#file_status");
var fileName = document.querySelector('#sendTextInput');

//--------------------------------------------
//-----------------UPLOAD---------------------
//--------------------------------------------

fileButton.addEventListener('change', function(e) { uploadFile(e) });

function uploadFile(e) {
  var file = e.target.files[0];
  var fileRef = storageRef.ref("openData/" + file.name);
  $("#load_messages_button").css("background", "white");

  var task = fileRef.put(file);
  task.on('state_changed',
    function progress(snapshot) {
      var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      var str = "linear-gradient(white, white " + (100 - percentage - 10) + "%, #b4fcb0 " + (100-percentage) + "%)";
      $("#load_messages_button").css("background", str);
    },
    function error(err) {
      $("#load_messages_button").css("background", "#ed9797");
      console.log(err.message);
    },
    function complete() {
      console.log("DONE upload");
      if(fileName.value != "")
        updateDatabase(fileRef, fileName.value);
      else updateDatabase(fileRef, file.name);
      loadMessageList();
      $("#load_messages_button").css("background", "#F3E978");
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
      console.log("DONE update");
      $("#load_messages_button").css("background", "#ccf2bc");
    }).catch(function(error) {
      console.log(error.message);
      $("#load_messages_button").css("background", "#ed9797");
    });
  });
}

//--------------------------------------------
//-----------------DELETE---------------------
//--------------------------------------------

function delete_files(database_file_id, storage_file_name) {
  if (!firebase.auth().currentUser) return;
  firestore.doc("openData/" + database_file_id).delete();
  storageRef.ref('openData/' + storage_file_name).delete().then(loadMessageList());
}
