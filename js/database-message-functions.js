//--------------------------------------------
//-----------------SEND-----------------------
//--------------------------------------------

const inputText = document.querySelector("#sendTextInput");
const saveButton = document.querySelector("#sendTextButton");

saveButton.addEventListener("click", function () {
  var text_status = document.getElementById("text_status");
  //CHECK LOGIN
  var user = firebase.auth().currentUser;

  if (!user) {
    // User is not signed in.
    text_status.innerHTML = "Būsena: KLAIDA - NEPRISIJUNGTA";
    return;
  }

  text_status.innerHTML = "Būsena: SIUNČIAMA";
  var date = moment().format('YYYY-MM-DD HH:mm:ss');
  var docRef = firestore.doc("approved_messages/" + date);
  docRef.set( {
    text: inputText.value,
    date: date
  }).then(function() {
    text_status.innerHTML = "Būsena: NUSIŲSTA";
  }).catch(function(error) {
    text_status.innerHTML = "Būsena: KLAIDA - " + error.message;
  });
});

//--------------------------------------------
//-----------------LOAD-----------------------
//--------------------------------------------

const load_messages_button = document.querySelector('#load_messages_button');
const load_messages_list = document.querySelector('#load_messages_list');

load_messages_button.addEventListener("click", function() {
  firestore.collection('approved_messages').get().then(function(snap) {
    var idx = 0;
    load_messages_list.innerHTML = "";
    snap.forEach(function(doc) {
      if(doc.data().text != "sample") {
        var text = "<li><b>" + idx + ". " + doc.data().date + '</b><br>' + doc.data().text + '<br><u onclick="delete_messages(' + "'" + doc.id + "'" + ')">IŠTRINTI</u>' + "</li>"
        load_messages_list.innerHTML += text;
      }
      idx++;
    })
  });
});

//--------------------------------------------
//-----------------DELETE---------------------
//--------------------------------------------

function delete_messages(document_id) {
  firestore.doc("approved_messages/" + document_id).delete();
  load_messages_button.click();
}
