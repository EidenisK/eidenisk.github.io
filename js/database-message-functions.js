//--------------------------------------------
//-----------------SEND-----------------------
//--------------------------------------------

const inputText = document.querySelector("#sendTextInput");
const saveButton = document.querySelector("#sendTextButton");
const linkText = document.querySelector('#sendLinkInput');
const text_status = document.getElementById("text_status");

saveButton.addEventListener("click", function () {
  if (!firebase.auth().currentUser) {
    text_status.innerHTML = "Būsena: KLAIDA - NEPRISIJUNGTA";
    return;
  }

  text_status.innerHTML = "Būsena: SIUNČIAMA";
  var docRef = firestore.doc("openData/" + date);
  docRef.set( {
    name: inputText.value,
    link: linkText.value,
    downloadURL: "sample",
    date: moment().format('YYYY-MM-DD HH:mm:ss')
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
  loadMessageList();
});

function loadMessageList() {
  firestore.collection('openData').get().then(function(snap) {
    var idx = 1;
    load_messages_list.innerHTML = "";
    snap.forEach(function(doc) {
      if(doc.data().name != "sample") {
        var link = doc.data().link, name = doc.data().name, date = doc.data().date, url = doc.data().downloadURL, id = doc.id;

        var text = "<li";
        if(idx % 2 == 0)
          text += ' class="lyginis"';
        text += "><b>" + idx + ". ";

        if(link != "sample")
          text += '<a href="' + link + '">' + name + "</a>";
        else text += name;

        text += "</b><br>" + date + '<br><u onclick="';

        if(url != "sample")
          text += 'delete_files(' + "'" + doc.id + "','" + name + "'";
        else
          text += 'delete_messages(' + "'" + doc.id + "'";

        text += ')">IŠTRINTI</u>';

        if(url != "sample")
          text += ', <a href="' + url + '">SIŲSTIS</a>';
        text += "</li>"

        load_messages_list.innerHTML += text;

        idx++;
      }
    });
  });
}

//--------------------------------------------
//-----------------DELETE---------------------
//--------------------------------------------

function delete_messages(document_id) {
  if (!firebase.auth().currentUser) {
    text_status.innerHTML = "Būsena: KLAIDA - NEPRISIJUNGTA";
    return;
  }
  firestore.doc("openData/" + document_id).delete();
  loadMessageList();
}
