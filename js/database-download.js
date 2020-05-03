function loadMessageList() {
  	firestore.collection(userID).get().then(function(snap) {
    	addCollectionToList(snap);
  	});
}

function addCollectionToList(snap)
{
  	load_messages_list.innerHTML = "";
  	snap.forEach(function(doc) {
	    var data = doc.id;
	    var pavadinimas = doc.data().pavadinimas;
	    var nuoroda = doc.data().nuoroda;
	    var tipas = doc.data().tipas;

	    var text = '<li><b>' + (nuoroda != 'null' ? '<a href="' + nuoroda + '">': '') + pavadinimas + '</a>';
	    text += '</b><br><div class="databaseDate">' + data + '</div>'
	    text += '<a href="#" onclick="delete_entry(' + "'" + doc.id + "'" + ')">IŠTRINTI</a></li>';
      
      	load_messages_list.innerHTML = text + load_messages_list.innerHTML;
    });
    if(load_messages_list.innerHTML == "")
    	load_messages_list.innerHTML = "<li>Sąrašas tuščias</li>";
}