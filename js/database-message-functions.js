//--------------------------------------------
//-----------------SEND-----------------------
//--------------------------------------------

const inputText = document.querySelector("#sendTextInput");
const saveButton = document.querySelector("#sendTextButton");
const linkText = document.querySelector('#sendLinkInput');
const text_status = document.getElementById("text_status");

function uploadMessage() {
  if (!firebase.auth().currentUser) {
    console.log("NEPRISIJUNGTA");
    $("#load_messages_button").css("background", "#ed9797");
    return;
  }

  $("#load_messages_button").css("background", "white");


  var date = moment().format('YYYY-MM-DD HH:mm:ss');
  var docRef = firestore.doc("openData/" + date);
  var nuoroda;
  if(linkText.value == "" || linkText.value == null || linkText.value == "Įveskite nuorodą (nebūtina)")
    nuoroda = "sample";
  else nuoroda = linkText.value;
  docRef.set( {
    name: inputText.value,
    link: nuoroda,
    downloadURL: "sample",
    date: date
  }).then(function() {
    console.log("DONE");
    $("#load_messages_button").css("background", "#ccf2bc");
  }).catch(function(error) {
    console.log(error.message);
    $("#load_messages_button").css("background", "#ed9797");
  });
}

//--------------------------------------------
//-----------------LOAD-----------------------
//--------------------------------------------

const load_messages_button = document.querySelector('#load_messages_button');
const load_messages_list = document.querySelector('#load_messages_list');

var view_mode = true;

$("#mode_button").click(function(e) {
  if (!firebase.auth().currentUser)
    return;

  if(!view_mode) {
    $("#upload_row").hide();
    $("#view_row").show();

    $("#up-icon").hide();
    $("#down-icon").show();
    loadMessageList();
    view_mode = true;
    $("#load_messages_button").css("background", "white");
  } else {
    $("#upload_row").show();
    $("#view_row").hide();

    $("#up-icon").show();
    $("#down-icon").hide();
    view_mode = false;
    $("#load_messages_button").css("background", "white");

  }
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
        text += "><b>";

        if(link != "sample")
          text += '<a href="' + link + '">' + name + "</a>";
        else text += name;

        text += "</b><br>" + '<div class="databaseDate">' + date + '</div><u onclick="';

        if(url != "sample")
          text += 'delete_files(' + "'" + doc.id + "','" + name + "'";
        else
          text += 'delete_messages(' + "'" + doc.id + "'";

        text += ')">IŠTRINTI</u>';

        if(url != "sample")
          text += ', <a href="' + url + '">SIŲSTIS</a>'; 
        text += "</li>"

        load_messages_list.innerHTML = text + load_messages_list.innerHTML;

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
