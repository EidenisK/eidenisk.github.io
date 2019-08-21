var signedIn = false;

$(document).ready(function() {
  var child = document.querySelector("#load_messages_list");
  child.style.paddingRight = child.offsetWidth - child.clientWidth + "px";

  /*let dropArea = document.getElementById('load_messages_button');
    ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
  })

  function preventDefaults (e) {
    e.preventDefault()
    e.stopPropagation()
  }

  ;['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
  })

  ;['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false)
  })

  function highlight(e) {
    dropArea.classList.add('highlight')
  }

  function unhighlight(e) {
    dropArea.classList.remove('highlight')
  }

  dropArea.addEventListener('drop', uploadFile, false)*/

})

function tryLogIn(event) {
  var loginPassword = document.getElementById("login_password");
  var loginStatus = document.querySelector('#login_status');

  var x = event.keyCode;
  if(x == 13 && !signedIn && loginPassword.value != null && loginPassword.value != "") {
    var pass = loginPassword.value;
    firebase.auth().signInWithEmailAndPassword('eidenis.gargzdai@gmail.com', pass).then(function() {
      loginStatus.innerHTML = "Būsena: PRISIJUNGTA";
      signedIn = true;
      $('#view_row').show();
      $('#login_row').hide();
      $("#mode_button").show();
      loadMessageList();
    }).catch(function(error) {
      $("#login_password").css("border-bottom", "2px solid red");
      console.log(error.message);
    });
  }
}

function trySendText(event) {
    if(event.keyCode == 13 && signedIn) {
      uploadMessage();
    }
}
