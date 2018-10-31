//--------------------------------------------
//-----------------SEND-----------------------
//--------------------------------------------

const inputText = document.querySelector("#sendTextInput");
const saveButton = document.querySelector("#sendTextButton");
const linkText = document.querySelector('#sendLinkInput');

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
  var docRef = firestore.doc("openData/" + date);
  docRef.set( {
    name: inputText.value,
    link: linkText.value,
    downloadURL: "sample",
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
  firestore.collection('openData').get().then(function(snap) {
    var idx = 1;
    load_messages_list.innerHTML = "";
    snap.forEach(function(doc) {
      if(doc.data().downloadURL != "sample") {
        var text = "<li><b>" + idx + ". " + doc.data().name + '</b><br>' + doc.data().date + '<br><u onclick="delete_files(' + "'" + doc.id + "','" + doc.data().name + "'" + ')">IŠTRINTI</u>, <a href="' + doc.data().downloadURL + '">SIŲSTIS</a>' + "</li>"
        load_messages_list.innerHTML += text;
      } else if(doc.data().name != "sample") {
        var text = "<li><b>" + idx + ". ";
        if(doc.data().link != "sample")
          text += '<a href="' + doc.data().link + '">' + doc.data().name + "</a>";
        else text += doc.data().name;
        text += '</b><br>' + doc.data().date + '<br><u onclick="delete_messages(' + "'" + doc.id + "'" + ')">IŠTRINTI</u>' + "</li>"
        load_messages_list.innerHTML += text;
      }
      idx++;
    });
  });
});

//--------------------------------------------
//-----------------DELETE---------------------
//--------------------------------------------

function delete_messages(document_id) {
  firestore.doc("openData/" + document_id).delete();
  load_messages_button.click();
}
