function loadMessageList() {
  firestore.collection('openData').get().then(function(snap) {
    addCollectionToList(snap, false);
  });

  firestore.collection('siuntiniai').get().then(function(snap) {
    addCollectionToList(snap, true);
  });  
}

function addCollectionToList(snap, isPublic)
{
  	var pirmas = true;
  	if(!isPublic) load_messages_list.innerHTML = "";
  	snap.forEach(function(doc) {
	  	if(pirmas && isPublic)
	  		load_messages_list.innerHTML = "<li><hr></li>" + load_messages_list.innerHTML;

	    var data = doc.id;
	    var pavadinimas = doc.data().pavadinimas;
	    var nuoroda = doc.data().nuoroda;
	    var tipas = doc.data().tipas;

	    var text = '<li><b>' + (nuoroda != 'null' ? '<a href="' + nuoroda + '">': '') + pavadinimas + '</a>';
	    text += '</b><br><div class="databaseDate">' + data + '</div>'
	    text += '<a href="#" onclick="delete_entry(' + "'" + doc.id + "'," + (isPublic ? "true" : "false") + ')">IŠTRINTI</a>';
     	if(isPublic) text += '<div class="tagPublic"> (VIEŠAS)</div>';
      	text += "</li>"
      
      	load_messages_list.innerHTML = text + load_messages_list.innerHTML;
      	pirmas = false;
    });
}